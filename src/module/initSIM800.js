// === НАСТРОЙКА МОДУЛЯ ===
import {sendAT} from "../utils/sendAT.js";

async function initSIM800(port) {
  await sendAT('AT',port);             // Проверка связи
  await sendAT('ATE0', port);           // Выключить эхо
  await sendAT('AT+CSCS="UCS2"', port);
  await sendAT('AT+CMGF=1', port);      // Текстовый режим
  await sendAT('AT+CNMI=2,2,0,0,0', port); // Автоотправка входящих
  console.log(`[${port.path}] готов к приему SMS`);
}

export { initSIM800 }
