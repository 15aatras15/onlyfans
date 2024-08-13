import { deletePublicMessage } from './admin/public-message.js'
import { deleteMedia, sendMedia, sendMediaId } from './admin/media.js'
import { verifyMembership } from './verify-membership.js'
import { texts } from '../texts.js'
import prisma from '../prisma/client.js'

// Define user roles
const USER_ROLES = {
  USER: 0,
  ADMIN: 1
}

// Handle the callback query for membership verification
export const CallbackQuery = async (bot, ctx) => {
  const userId = ctx.from.id
  const user = await prisma.user.findUnique({ where: { telegramId: userId } })

  // Check if user is blocked
  if (user && user.status === 'blocked') {
    return bot.answerCallbackQuery(ctx.id, {
      text: texts.general.blockAlert,
      show_alert: true,
    })
  }
  
  // Handle membership verification for all users
  if (ctx.data.includes('vrf_mem')) {
    return await verifyMembership(bot, ctx, user)
  }

  // Define callback handlers for each role
  const callbackHandlers = {
    [USER_ROLES.USER]: {
      // 'amt': walletAmount, // amount
    },
    [USER_ROLES.ADMIN]: {
      'del_pub_msg': deletePublicMessage, // delete_public_message
      'snd_md': sendMedia, // send_media
      'edt_md': sendMediaId, // send_media
      'del_md': deleteMedia, // send_media
      
    }
  }

  // Get handlers for the user's role
  const roleHandlers = callbackHandlers[user.role] || {}

  // Find the appropriate handler
  const handler = Object.entries(roleHandlers).find(([key, func]) => ctx.data.startsWith(key))

  if (handler) {
    // If handler found, execute it
    await handler[1](bot, ctx, user)
  } else {
    // If no handler found, send error message
    bot.answerCallbackQuery(ctx.id, {
      text: texts.general.notAccess,
      show_alert: true,
    })
  }
}