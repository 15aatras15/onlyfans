import { adminMenu, adminMenuItems, backMenuItems } from '../../menu.js'
import { publicMessage, sendPublicMessage } from './public-message.js'
import { editMedia, manageMedia, saveMedia } from './media.js'
import { backAdminMenu } from '../back.js'
import { texts } from '../../texts.js'

// Handle the callback ctx for membership verification
export const adminEvent = async (bot, ctx, user) => {
  const chatId = ctx.chat.id
  const message = ctx.text

  if (message === backMenuItems[0]) { // لغو و بازگشت به منو اصلی ⬅️
    return await backAdminMenu(bot, ctx)
  }

  if (user.status) {
    if (user.status === 'awaiting_public_message') {
      await publicMessage(bot, ctx, user)
    } else if (user.status.startsWith('awaiting_create_media')) {
      await saveMedia(bot, ctx, user)
    } else if (user.status === 'awaiting_edit_media') {
      await editMedia(bot, ctx, user)
    }
  } else {
    if (message === adminMenuItems[0]) {        // 📩 ارسال پیام همگانی
      await sendPublicMessage(bot, ctx, user)
    } else if (message === adminMenuItems[1]) { // 📺 مدیا ها
      await manageMedia(bot, ctx, user)
    } else {
      bot.sendMessage(chatId, texts.general.continue, adminMenu)
    }
  }
}
