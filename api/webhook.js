const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const update = req.body;
      
      // Handle messages
      if (update.message) {
        await handleMessage(update.message);
      }
      
      // Handle callbacks
      if (update.callback_query) {
        await handleCallback(update.callback_query);
      }
      
      res.status(200).json({ status: 'OK' });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

async function handleMessage(message) {
  if (message.text === '/start') {
    const keyboard = {
      inline_keyboard: [
        [
          { text: "📢 Join Channel 1", url: "https://t.me/your_channel1" },
          { text: "📢 Join Channel 2", url: "https://t.me/your_channel2" }
        ],
        [
          { text: "✅ I Have Joined", callback_data: "verify_join" }
        ]
      ]
    };
    
    await bot.sendMessage(message.chat.id, 
      `🎉 *Welcome to Happy Bot!*\n\nGenerate your tracking link and get complete data!`,
      { parse_mode: 'Markdown', reply_markup: keyboard }
    );
  }
}

async function handleCallback(callback) {
  if (callback.data === 'verify_join') {
    const websiteUrl = process.env.WEBSITE_URL;
    const personalLink = `${websiteUrl}?id=${callback.from.id}`;
    
    await bot.sendMessage(callback.message.chat.id,
      `✅ *Your Personal Link:*\n\`${personalLink}\`\n\n🔧 *Happy Bot*`,
      { parse_mode: 'Markdown' }
    );
  }
  
  await bot.answerCallbackQuery(callback.id);
}
