import { checkMembershipChannels } from '../utils/membership.js'
import { createJoinButtons } from '../utils/createButtons.js'
import { adminMenu } from '../menu.js'
import { sendMedia } from './media.js'
import { CONFIG } from '../config.js'
import { texts } from '../texts.js'
import prisma from '../prisma/client.js'

// Handle the /start command
export const Start = async (bot, ctx) => {
  const userId = ctx.from.id
  const chatId = ctx.chat.id

  try {
    const { allMembers, remainingChannels } = await checkMembershipChannels(
      bot,
      userId,
      CONFIG.channels
    )

    let user = await prisma.user.findUnique({ where: { telegramId: userId } })

    if (user && user.status) return

    if (!user) {
      user = await prisma.user.create({ data: { telegramId: userId } })
    }

    if (allMembers) {
      const mediaId = ctx.text.split(' ').pop()
      const mediaHandled = await sendMedia(bot, chatId, mediaId)
      if (mediaHandled) return

      if (user && user.role > 0) {
        bot.sendMessage(chatId, texts.general.welcome, adminMenu)
      } else {
        bot.sendMessage(chatId, texts.general.welcome)
      }
    } else {
      const mediaId = ctx.text.split(' ').pop()
      const buttons = createJoinButtons(remainingChannels, null, mediaId)
      bot.sendMessage(chatId, texts.general.promptToJoin, {
        reply_markup: {
          inline_keyboard: buttons,
        },
        parse_mode: 'HTML',
      })
    }

    return
  } catch (error) {
    console.error(error)
    return bot.sendMessage(chatId, texts.general.failProcess)
  }
}
