import 'dotenv/config'
import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import {initSIM800} from "./module/initSIM800.js";
import {decodeUCS2} from "./utils/decodeUCS2.js";
import {extractUCS2Phone} from "./utils/extractUCS2Phone.js";
import Message from "./module/Message.js";
import {generateClients} from "./utils/generateClients.js";

const createDevise = (chatId, path) => {
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
    console.log('Error: ', err.message)
  })

  return port
}

const clients = generateClients()

console.log(clients)

clients.map(({ chatId, device }) => createDevise(chatId, device))
