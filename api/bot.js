const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const update = req.body;
      
      if (update.message?.text === '/start') {
        const chatId = update.message.chat.id;
        const userId = update.message.from.id;
        const link = `https://free1gb.vercel.app?id=${userId}`;
        
        await bot.sendMessage(chatId, 
          `🎉 Your personal link:\n\n${link}\n\nShare this to get data!`,
          { parse_mode: 'Markdown' }
        );
      }
      
      res.json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
