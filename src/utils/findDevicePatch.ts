import {checkDevicePatch} from "./checkDevicePatch.ts";

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const findDevicePatch = ({ patch, productId }: { productId: string; patch: string}) => new Promise<string>(async (resolve) => {
  console.log('[Подключение] Поиск', productId, patch)
  let devicePatch = await checkDevicePatch(productId, patch)

  while (!devicePatch) {
    console.log('[Подключение] Устройство не найдено, повтор через 5 сек', productId)
    devicePatch = await checkDevicePatch(productId, patch)
    await delay(5000)
  }

  console.log('[Подключение] Устройство найдено', productId, devicePatch)
  resolve(devicePatch)
})
