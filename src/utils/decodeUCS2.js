function decodeUCS2(hexStr) {
  const buffer = Buffer.from(hexStr, 'hex');
  const swapped = Buffer.alloc(buffer.length);

  for (let i = 0; i < buffer.length; i += 2) {
    swapped[i] = buffer[i + 1];
    swapped[i + 1] = buffer[i];
  }

  return swapped.toString('ucs2');
}

export { decodeUCS2 }
