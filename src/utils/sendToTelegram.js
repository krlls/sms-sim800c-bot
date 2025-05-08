import axios from 'axios'
import {TELEGRAM_TOKEN} from "../conf/env.js";

async function sendToTelegram(chatId, text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: chatId,
      parse_mode: "HTML",
      text
    });
    console.log(`[TELEGRAM] Чат: ${chatId} отправлено`);
  } catch (e) {
    console.error(`[TELEGRAM] Чат: ${chatId} ошибка:`, e.message);
  }
}

function formatSMS(phone, text) {
  return `
<b>📩</b> <code>${phone}</code>
<b></b>
<b>💬</b> ${text}
`
}

export { sendToTelegram, formatSMS }
