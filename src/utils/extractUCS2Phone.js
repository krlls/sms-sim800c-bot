function extractUCS2Phone(line) {
  const match = line.match(/^\+CMT:\s*"([0-9A-F]+)"/);
  if (match) {
    return match[1]; // UCS2 строка
  }
  return null;
}

export { extractUCS2Phone }
