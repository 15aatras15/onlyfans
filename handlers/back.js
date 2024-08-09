import { adminMenu } from '../menu.js'
import { texts } from '../texts.js'
import prisma from '../prisma/client.js'

export const backAdminMenu = async (bot, ctx) => {
  const chatId = ctx.chat.id

  await prisma.user.update({
    where: { telegramId: ctx.from.id },
    data: { status: null },
  })

  return bot.sendMessage(chatId, texts.general.continue, adminMenu)
}