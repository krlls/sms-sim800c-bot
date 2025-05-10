import {TELEGRAM_TOKEN} from "../conf/env.ts";

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

    console.log(`[TELEGRAM] Чат: ${chatId} отправлено`);
  } catch (e) {
    console.error(`[TELEGRAM] Чат: ${chatId} ошибка:`, e.message);
  }
}

function formatSMS(phone, text) {
  return `
<b>📩</b> <code>${phone}</code>
<b></b>
${text}
`
}

export { sendToTelegram, formatSMS }
