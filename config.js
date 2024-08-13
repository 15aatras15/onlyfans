import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  botToken: process.env.BOT_TOKEN,
  apiId: process.env.API_ID,
  apiHash: process.env.API_HASH,
  botUsername: 'OFCLOUDBOT', // dont use @
  timer: 30, // secend
  channels: [
    {
      name: 'OnlyFans',
      id: '-1002191204594',
      link: 'https://t.me/onllyffans',
    },
  ],
}
