export function isLatinCharactersOnly(text) {
  // Проверяем, нет ли кириллицы
  return !/[А-Яа-яЁё]/.test(text);
}
