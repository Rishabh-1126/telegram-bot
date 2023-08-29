const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const SingleInstance = require("single-instance");
require("dotenv").config();

const telegramToken = process.env.BOT_KEY;
const openaiKey = process.env.OPENAI_KEY;

// Create a new single instance
const instance = new SingleInstance("telegram-bot-instance");

// Check if this instance is primary (first to start)
if (!instance.isPrimaryInstance()) {
  console.log("Another instance is already running.");
  process.exit(0);
}

const bot = new TelegramBot(telegramToken, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Hi");
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci/completions",
      {
        prompt: text,
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: `Bearer ${openaiKey}`,
        },
      }
    );

    const answer = response.data.choices[0].text.trim();
    bot.sendMessage(chatId, answer);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "An error occurred.");
  }
});
