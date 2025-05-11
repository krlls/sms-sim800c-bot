import {getDevicePatch} from "./getDevicePatch.ts";

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const findDevicePatch = (chatId, product) => new Promise<string>(async (resolve) => {
  console.log('[Подключение] Поиск', product)
  let devicePatch = await getDevicePatch(product)

  while (!devicePatch) {
    console.log('[Подключение] Устройство не найдено, повтор через 5 сек', product)
    devicePatch = await getDevicePatch(product)
    await delay(5000)
  }

  console.log('[Подключение] Устройство найдено', product, devicePatch)
  resolve(devicePatch)
})
