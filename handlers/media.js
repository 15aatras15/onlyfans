import prisma from '../prisma/client.js'
import { texts } from '../texts.js'
import { CONFIG } from '../config.js'

export const sendMedia = async (bot, chatId, mediaId) => {

  if (mediaId !== '/start') {

    if (!(mediaId.length === 24 && /^[0-9a-fA-F]+$/.test(mediaId))) return false

    const media = await prisma.media.findUnique({ where: { id: mediaId } })

    if (media && media.files.length > 0) {
      const files = media.files
      let messageIds = []

      if (media.type === 'L') {
        const limitedFiles = files.slice(0, 40)
        for (const file of limitedFiles) {
          if (file.type === 'photo') {
            const message = await bot.sendPhoto(chatId, file.id)
            messageIds.push(message.message_id)
          } else if (file.type === 'video') {
            const message = await bot.sendVideo(chatId, file.id)
            messageIds.push(message.message_id)
          }
        }
      } else {
        const limitedFiles = files.slice(0, 10)
        const mediaGroup = limitedFiles.map((file) => ({
          type: file.type,
          media: file.id,
        }))
        const messages = await bot.sendMediaGroup(chatId, mediaGroup)
        messageIds = messages.map((message) => message.message_id)
      }

      const warningMsg = await bot.sendMessage(chatId, texts.general.fileWarning)
      messageIds.push(warningMsg.message_id)

      setTimeout(async () => {
        for (const messageId of messageIds) {
          await bot.deleteMessage(chatId, messageId)
        }
        await bot.sendMessage(chatId, texts.general.deleteMedia, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '♻️ دانلود مجدد',
                  url: `https://t.me/${CONFIG.botUsername}?start=${media.id}`,
                },
              ],
            ],
          },
        })
      }, CONFIG.timer * 1000)
    }

    return true
  }
  return false
}
