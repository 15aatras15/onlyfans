import { CONFIG } from '../config.js'
import { texts } from '../texts.js'

// Handle the chat member update event
export const ChatMember = async (bot, ctx) => {
  try {
    const status = ctx.new_chat_member.status
    const userId = ctx.from.id
    const channelId = ctx.chat.id

    // Checking the user's exit from the channel
    if (status === 'left') {
      // Find the channel from which the user left
      const channel = CONFIG.channels.find((c) => c.id === String(channelId))
      if (channel) {
        // Create buttons for rejoining the channel and confirming membership
        const buttons = [
          [{ text: 'عضویت مجدد در کانال', url: channel.link }],
          [{ text: 'عضو شدم ✅', callback_data: 'revrf_mem' }],
        ]

        // Remove the keyboard from the user's chat
        await bot.sendMessage(userId, ':(', {
          reply_markup: {
            remove_keyboard: true,
          },
        }).then((msg) => {
          bot.deleteMessage(userId, msg.message_id) // Delete the message after removing the keyboard
        })

        // Send a message to the user prompting them to rejoin the channel
        await bot.sendMessage(userId, texts.general.leftChannel(channel.name), {
          reply_markup: {
            inline_keyboard: buttons,
          },
          parse_mode: 'HTML',
        })
      }
    }
    
  } catch (error) {
    console.log('Error handling chat member update:', error)
  }
}
