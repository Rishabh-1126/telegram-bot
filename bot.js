const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const telegramToken = process.env.BOT_KEY;
const openaiKey = process.env.OPENAI_KEY;

// Check if lock file exists
if (fs.existsSync("bot.lock")) {
  console.log("Another instance is already running.");
  process.exit(0);
}

// Create lock file
fs.writeFileSync("bot.lock", "");

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

// Remove lock file when the bot is stopped
process.on("SIGINT", () => {
  fs.unlinkSync("bot.lock");
  process.exit();
});
