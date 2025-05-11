import {TELEGRAM_TOKEN} from "../conf/env.ts";
import { phoneFormatter } from './phoneFormatter.ts'

async function sendToTelegram(chatId, text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: "HTML",
        text
      })
    });

    console.log(`[Telegram] [${chatId}] Отправлено`);
  } catch (e) {
    console.error(`[Telegram] [${chatId}] Ошибка:`, e.message);
  }
}

function formatSMS(phone, text) {
  return `
<b>📩</b> ${isNaN(phone) ? phone : phoneFormatter(phone, ' (NNN) NNN-NN-NN')}

${text}
`.replace(/((\r?\n)|\r){3,}/g, '\n\n');
}

export function formatPhone(phone) {
  return `📲 Входящий вызов от ${phoneFormatter(phone, ' (NNN) NNN-NN-NN')}`
}

export { sendToTelegram, formatSMS }
