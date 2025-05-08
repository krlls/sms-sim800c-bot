import axios from 'axios'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN

// === ОТПРАВКА В ТЕЛЕГРАМ ===
async function sendToTelegram(chatId, text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: chatId,
      parse_mode: "HTML",
      text
    });
    console.log('[TELEGRAM] отправлено', chatId);
  } catch (e) {
    console.error('[TELEGRAM] ошибка:', e.message);
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
