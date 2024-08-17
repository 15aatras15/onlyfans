import { CallbackQuery } from './handlers/callback-query.js'
import { ChatMember } from './handlers/chat-member.js'
import { Message } from './handlers/message.js'
import { Start } from './handlers/start.js'
import { CONFIG } from './config.js'
import TelegramBot from 'node-telegram-bot-api'

// Create an instance of the Telegram bot
const bot = new TelegramBot(CONFIG.botToken, { polling: true })

try {
  // Register event handlers
  bot.onText(/\/start/, (ctx) => Start(bot, ctx))

  bot.on('callback_query', (ctx) => CallbackQuery(bot, ctx))

  bot.on('chat_member', (ctx) => ChatMember(bot, ctx))

  bot.on('message', (ctx) => Message(bot, ctx))

  console.log('Bot is running...')
} catch (error) {}
