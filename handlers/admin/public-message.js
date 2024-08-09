import { createDeleteButton } from '../../utils/createButtons.js'
import { adminMenu, backMenu } from '../../menu.js'
import { texts } from '../../texts.js'
import prisma from '../../prisma/client.js'

export const sendPublicMessage = async (bot, ctx, user) => {
  const chatId = ctx.chat.id

  await prisma.user.update({
    where: { telegramId: user.telegramId },
    data: { status: 'awaiting_public_message' },
  })

  bot.sendMessage(chatId, texts.publicMessage.requestMessage, backMenu)
}

export const publicMessage = async (bot, ctx, user) => {
  const chatId = ctx.chat.id
  const messageId = ctx.message_id

  if (user.role === 1) {
    // If user === ADMIN

    const users = await prisma.user.findMany()

    const msges = []
    const ownerMsges = []
    for (const user of users) {
      let msg = null
      if (user.role === 1) {
        msg = await bot.copyMessage(user.telegramId, chatId, messageId)
        ownerMsges.push(`${user.telegramId}-${msg.message_id}`)
      } else {
        msg = await bot.copyMessage(user.telegramId, chatId, messageId)
      }
      msges.push(`${user.telegramId}-${msg.message_id}`)
    }

    const sentMessage = await prisma.sentMessage.create({
      data: {
        chatId: chatId.toString(),
        messageId: messageId.toString(),
        messages: msges.join(','),
        status: 'confirmed',
        handlerId: user.id,
      },
    })

    for (const msg of ownerMsges) {
      const [chatId, messageId] = msg.split('-')
      await bot.editMessageReplyMarkup(
        {
          inline_keyboard: [createDeleteButton(`pub_msg_${sentMessage.id}`)],
        },
        {
          chat_id: chatId,
          message_id: messageId,
        }
      )
    }

    bot.sendMessage(chatId, texts.publicMessage.sentToAll, adminMenu)
  } else {
    bot.sendMessage(chatId, texts.general.notAccess)
  }

  await prisma.user.update({
    where: { telegramId: user.telegramId },
    data: { status: null },
  })
}

export const deletePublicMessage = async (bot, ctx, user) => {
  const userId = ctx.from.id
  const message = ctx.message
  const [sentMessageId] = ctx.data.split('_').slice(3)

  const sentMessage = await prisma.sentMessage.findUnique({
    where: { id: sentMessageId },
  })

  if (!sentMessage) {
    return bot.sendMessage(message.chat.id, texts.publicMessage.notFoundSentMessage)
  }

  if (sentMessage.status === 'confirmed') {
    const msges = sentMessage.messages.split(',')

    for (const msg of msges) {
      const [chatId, messageId] = msg.split('-')
      bot.deleteMessage(chatId, messageId)
    }

    await prisma.sentMessage.update({
      where: { id: sentMessage.id },
      data: { status: 'deleted', messages: null, handlerId: user.id },
    })

    bot.sendMessage(message.chat.id, texts.publicMessage.deleteMessage)

    if (message.chat.id !== parseInt(sentMessage.chatId)) {
      bot.sendMessage(sentMessage.chatId, texts.publicMessage.deleteAdminMessage)
    }
  }
}
