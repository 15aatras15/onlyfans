import { adminEvent } from './admin/event.js'
import { adminMenuItems } from '../menu.js'
import { texts } from '../texts.js'
import prisma from '../prisma/client.js'

export const Message = async (bot, ctx) => {
  const chatId = ctx.chat.id // Get the chat ID
  const userId = ctx.from.id // Get the user ID
  const text = ctx.text // Get the text message

  if (text && text.startsWith('/start')) return

  try {
    let user = await prisma.user.findUnique({ where: { telegramId: userId } }) // Fetch the user from the database using their Telegram ID

    if (!user) {
      user = await prisma.user.create({ data: { telegramId: userId } })
    }
    
    if (user && user.status === 'blocked') {
      return bot.sendMessage(chatId, texts.general.blockMessage)
    }

    // Check if the message text is part of main menu items or admin menu items
    if (adminMenuItems.includes(text)) {
      // If the user exists and has a phone number
      if (user) {
        // Check if user has an admin
        if (user.role > 0) {
          await adminEvent(bot, ctx, user) // Handle admin-specific events
        }
      }
    } else {
      // If the message text is not part of main menu items or admin menu items
      if (user) {
        // Check if user has an admin
        if (user.role > 0) {
          await adminEvent(bot, ctx, user) // Handle admin-specific events with status = true
        }
      }
    }
  } catch (error) {
    console.error(error) // Log any errors
    return bot.sendMessage(chatId, texts.general.failProcess) // Send process error message to the user
  }
}
