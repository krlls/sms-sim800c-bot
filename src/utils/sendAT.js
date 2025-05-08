// === ОТПРАВКА AT-КОМАНД ===
function sendAT(command, port) {
  return new Promise((resolve) => {
    port.write(command + '\r');
    setTimeout(resolve, 300);
  });
}

export { sendAT }
