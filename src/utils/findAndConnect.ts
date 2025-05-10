import {getDevicePatch} from "./getDevicePatch.ts";
import {createConnection} from "./createConnection.ts";

export const findAndConnect = async (chatId, product) => {
  console.log('[Подключение] Поиск', product)
  const devicePatch = await getDevicePatch(product)

  if (!devicePatch) {
    console.log('[Подключение] Устройство не найдено, повтор через 5 сек', product)
    return setTimeout(() => findAndConnect(chatId, product), 5000)
  }

  console.log('[Подключение] Устройство найдено', product, devicePatch)
  return createConnection(chatId, devicePatch)
}
