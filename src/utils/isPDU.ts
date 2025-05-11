export function isPDU(str) {
  return /^[0-9A-F]+$/i.test(str) && str.length >= 30;
}
