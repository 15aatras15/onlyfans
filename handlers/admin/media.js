import { adminMenu, backMenu } from '../../menu.js'
import { CONFIG } from '../../config.js'
import { texts } from '../../texts.js'
import prisma from '../../prisma/client.js'

export const manageMedia = async (bot, ctx, user) => {
  const chatId = ctx.chat.id

  bot.sendMessage(chatId, texts.media.manageMedia, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📦 ایجاد گالری', callback_data: `snd_md_G` },
          { text: '📃 ایجاد لیست', callback_data: `snd_md_L` },
        ],
        [{ text: '✍️ ویرایش مدیا', callback_data: `edt_md` }],
      ],
    },
    parse_mode: 'HTML',
  })
}

export const sendMedia = async (bot, ctx, user) => {
  const message = ctx.message
  const chatId = message.chat.id
  const messageId = message.message_id
  const type = ctx.data.split('_').pop()

  let media = await prisma.media.findFirst({ where: { type: type, files: { equals: [] } } })

  if (!media) media = await prisma.media.create({ data: { type: type } })

  await prisma.user.update({
    where: { telegramId: user.telegramId },
    data: { status: `awaiting_create_media_${media.id}` },
  })

  await bot.deleteMessage(chatId, messageId)
  await bot.sendMessage(chatId, texts.media.sendMedia(media), { ...backMenu, parse_mode: 'HTML' })
}

export const sendMediaId = async (bot, ctx, user) => {
  const message = ctx.message
  const chatId = message.chat.id
  const messageId = message.message_id

  await prisma.user.update({
    where: { telegramId: user.telegramId },
    data: { status: `awaiting_edit_media` },
  })

  await bot.deleteMessage(chatId, messageId)
  await bot.sendMessage(chatId, texts.media.sendMediaId, backMenu)
}

export const editMedia = async (bot, ctx, user) => {
  const chatId = ctx.chat.id
  const text = ctx.text // Get the text message

  if (!/^[a-fA-F0-9]{24}$/.test(text))
    return await bot.sendMessage(chatId, texts.media.invalidMediaId)

  const media = await prisma.media.findUnique({ where: { id: text } })

  if (!media) return await bot.sendMessage(chatId, texts.media.notFoundMedia)

  await prisma.user.update({
    where: { telegramId: user.telegramId },
    data: { status: `` },
  })

  await bot.sendMessage(chatId, texts.media.editMediaInfo, adminMenu)
  await bot.sendMessage(chatId, texts.media.editMedia(), {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🗑 حذف مدیا', callback_data: `del_md_${media.id}` }
        ],
      ],
    },
    parse_mode: 'HTML',
  })
}

export const deleteMedia = async (bot, ctx, user) => {
  const message = ctx.message
  const chatId = message.chat.id
  const messageId = message.message_id
  const mediaId = ctx.data.split('_').pop()

  await prisma.media.delete({ where: { id: mediaId } })

  bot.editMessageText(texts.media.deleteMedia, {
    chat_id: chatId,
    message_id: messageId,
  })
}

export const saveMedia = async (bot, ctx, user) => {
  const chatId = ctx.chat.id
  const userInfo = await prisma.user.findUnique({ where: { telegramId: chatId } })

  // Extracting the mediaId from the user's status
  const mediaId = userInfo.status.split('_').pop()

  // Fetching the media details from the database
  let media = await prisma.media.findUnique({ where: { id: mediaId } })

  // Determine the type of media and set limits
  const isListMedia = media.type === 'L'
  const maxItems = isListMedia ? 40 : 10 // 10 is the common limit for Telegram galleries, adjust based on your needs.
  const mediaTypeText = isListMedia ? 'لیست' : 'گالری'

  if (ctx.text && ctx.text === 'END') {
    await prisma.user.update({
      where: { telegramId: user.telegramId },
      data: { status: `` },
    })

    await bot.sendMessage(
      chatId,
      texts.media.getLink(CONFIG.botUsername, media.id, mediaTypeText),
      {
        ...adminMenu,
        parse_mode: 'HTML',
      }
    )
    return
  }

  // Adding the media file based on its type (photo/video)
  if (ctx.photo) {
    const fileId = ctx.photo.pop().file_id

    media = await prisma.media.update({
      where: { id: mediaId },
      data: {
        files: {
          push: { id: fileId, type: 'photo' },
        },
      },
    })

    if (media.files.length > maxItems) return
    await bot.sendMessage(chatId, texts.media.addImage(maxItems, media.files.length), {
      parse_mode: 'HTML',
    })
  } else if (ctx.video) {
    const fileId = ctx.video.file_id

    media = await prisma.media.update({
      where: { id: mediaId },
      data: {
        files: {
          push: { id: fileId, type: 'video' },
        },
      },
    })

    if (media.files.length > maxItems) return
    await bot.sendMessage(chatId, texts.media.addVideo(maxItems, media.files.length), {
      parse_mode: 'HTML',
    })
  } else {
    await bot.sendMessage(chatId, texts.media.invalidFileType)
  }

  // Check if media is already full
  if (media.files.length >= maxItems) {
    if (media.files.length > maxItems) return
    await prisma.user.update({
      where: { telegramId: user.telegramId },
      data: { status: `` },
    })

    await bot.sendMessage(
      chatId,
      texts.media.fullMedia(CONFIG.botUsername, media, mediaTypeText),
      { ...adminMenu, parse_mode: 'HTML' }
    )
  }
}
