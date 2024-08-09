import { checkMembershipChannels } from '../utils/membership.js'
import { createJoinButtons } from '../utils/createButtons.js'
import { texts } from '../texts.js'
import { adminMenu } from '../menu.js'
import { CONFIG } from '../config.js'
import prisma from '../prisma/client.js'

// Handle the callback ctx for membership verification
export const verifyMembership = async (bot, ctx) => {
  const userId = ctx.from.id
  const message = ctx.message
  const chatId = message.chat.id

  try {
    const { allMembers, remainingChannels } = await checkMembershipChannels(
      bot,
      userId,
      CONFIG.channels
    )

    const user = await prisma.user.findUnique({ where: { telegramId: userId } })

    if (allMembers) {
      await bot.deleteMessage(chatId, message.message_id)
      if (user && user.role === 1) {
        bot.sendMessage(chatId, texts.general.welcome, adminMenu)
      } else {
        bot.sendMessage(chatId, texts.general.welcome)
      }
    } else {
      const reverify = ctx.data === 'vrf_mem' ? false : true
      const buttons = createJoinButtons(remainingChannels, reverify)
      const newText = reverify
        ? texts.general.promptToRejoin(remainingChannels.length)
        : texts.general.promptToJoin

      if (
        message.text !== newText ||
        JSON.stringify(message.reply_markup.inline_keyboard) !== JSON.stringify(buttons)
      ) {
        bot.editMessageText(newText, {
          chat_id: chatId,
          message_id: message.message_id,
          reply_markup: {
            inline_keyboard: buttons,
          },
          parse_mode: 'HTML',
        })
      }
      bot.answerCallbackQuery(ctx.id, {
        text: texts.general.failPromptToJoin,
        show_alert: true,
      })
    }
  } catch (error) {
    console.error('Error verifying user membership:', error)
    bot.answerCallbackQuery(ctx.id, { text: texts.general.failMembershipCheck })
  }
}
