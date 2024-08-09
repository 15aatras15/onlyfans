import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  botToken: process.env.BOT_TOKEN,
  apiId: process.env.API_ID,
  apiHash: process.env.API_HASH,
  botUsername: 'onllllyfans_bot', // dont use @
  timer: 30, // secend
  channels: [
    {
      name: 'کتاب',
      id: '-1002221848617',
      link: 'https://t.me/Samary_book',
    },
    {
      name: 'انگیسی',
      id: '-1002228261162',
      link: 'https://t.me/+EOMamSPS_H8zZjM0',
    },
  ],
}
