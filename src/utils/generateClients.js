
const clientsStr = process.env.CLIENTS

export function generateClients() {
  return clientsStr.split(';').map((c) => ({ chatId: c.split(':')[0], device: c.split(':')[1]}))
}
