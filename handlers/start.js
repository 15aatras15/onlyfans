import { checkMembershipChannels } from '../utils/membership.js'
import { createJoinButtons } from '../utils/createButtons.js'
import { adminMenu } from '../menu.js'
import { CONFIG } from '../config.js'
import { texts } from '../texts.js'
import prisma from '../prisma/client.js'

// Handle the /start command
export const Start = async (bot, ctx) => {
  const userId = ctx.from.id
  const chatId = ctx.chat.id

  try {
    const { allMembers, remainingChannels } = await checkMembershipChannels(bot, userId, CONFIG.channels)

    let user = await prisma.user.findUnique({ where: { telegramId: userId } })

    if (user && user.status) return

    if (!user) {
      user = await prisma.user.create({ data: { telegramId: userId }})
    }

    const mediaId = ctx.text.split(' ').pop()

    if (mediaId !== '/start') {
      const media = await prisma.media.findUnique({ where: { id: mediaId } })

      if (media && media.files.length > 0) {
        const files = media.files
        let messageIds = []

        if (media.tupe === 'L') {
          const limitedFiles = files.slice(0, 40)
          for (const file of limitedFiles) {
            const message = await bot.sendPhoto(chatId, file.id)
            messageIds.push(message.message_id)
          }
        } else {

          const limitedFiles = files.slice(0, 10)
          const mediaGroup = limitedFiles .map(file => ({
            type: file.type,
            media: file.id
          }))
          const messages = await bot.sendMediaGroup(chatId, mediaGroup)
          messageIds = messages.map(message => message.message_id)
        }

        const warningMsg = await bot.sendMessage(chatId, texts.general.fileWarning)
        messageIds.push(warningMsg.message_id)

        setTimeout( async () => {
          for (const messageId of messageIds) {
            await bot.deleteMessage(chatId, messageId);
          }
          bot.sendMessage(chatId, texts.general.deleteMedia, {
            reply_markup: {
              inline_keyboard: [[{ text: '♻️ دانلود مجدد', url: `https://t.me/${CONFIG.botUsername}?start=${media.id}` }]],
            },
          })
        }, CONFIG.timer * 1000)
      }
      return
    }

    if (allMembers) {
      if (user && user.role > 0) {
        bot.sendMessage(chatId, texts.general.welcome, adminMenu)
      } else {
        bot.sendMessage(chatId, texts.general.welcome)
      }
    } else {
      const buttons = createJoinButtons(remainingChannels)
      bot.sendMessage(chatId, texts.general.promptToJoin, {
        reply_markup: {
          inline_keyboard: buttons,
        },
        parse_mode: 'HTML',
      })
    }

    return
  } catch (error) {
    console.error('Error verifying user membership:', error)
    bot.sendMessage(chatId, texts.general.failMembershipCheck)

    return
  }
}
