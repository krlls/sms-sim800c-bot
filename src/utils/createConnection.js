import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import Message from "../module/Message.js";
import {decodeUCS2} from "./decodeUCS2.js";
import {extractUCS2Phone} from "./extractUCS2Phone.js";
import {initSIM800} from "../module/initSIM800.js";
import {findAndConnect} from "./findAndConnect.js";
import {clients } from "./generateClients.js";

export const createConnection = (chatId, path) => {
  let waitingForSMS = false;
  const message = new Message(chatId)

  const port = new SerialPort({ path, baudRate: 9600 });
  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  parser.on('data', async line => {
    if (line.startsWith('+CMT:')) {
      waitingForSMS = true;

      const decodedPhone = decodeUCS2(extractUCS2Phone(line))
      message.setPhone(decodedPhone)

    } else if (waitingForSMS) {
      console.log(`[${path}]`, 'Сообщение принято, ждем 15 сек')
      message.appendMessage(decodeUCS2(line))
      message.sendToTelegram()
      waitingForSMS = false
    }
  });

  port.on('open', async () => {
    console.log('[PORT] открыт:', path);
    await initSIM800(port);
  });

  port.on('error', function(err) {
    console.log(`[${path}] Error: `, err.message)
  })

  port.on('close', function(err) {
    console.log(`[${path}] Отключен`)

    const client = clients.find((c) => c.chatId === chatId)

    if (!client) return

    findAndConnect(chatId, client.device)
  })

  return { port, chatId, path}
}
