const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// Set your Telegram Bot API token and OpenAI API key
const telegramToken = "6166135441:AAEFhDtO8dT5ctXj03xZZjgnU8wcQ9cgfco";
const openaiKey = "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";

const bot = new TelegramBot(telegramToken, { polling: true });
console.log("chl rha h ??");
bot.onText(/\/start/, (msg) => {
  console.log("telegram");
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
