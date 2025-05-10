import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import Message from "../module/Message.ts";
import {decodeUCS2} from "./decodeUCS2.ts";
import {extractUCS2Phone} from "./extractUCS2Phone.ts";
import {findAndConnect} from "./findAndConnect.ts";
import {clients } from "./generateClients.ts";
import { SIM800 } from '../module/SIM800.ts'
import { Task } from '../module/Task.ts'
import { sendToTelegram } from './sendToTelegram.ts'

export const createConnection = (chatId, path) => {
  let waitingForSMS = false;
  const message = new Message(chatId)

  const port = new SerialPort({ path, baudRate: 9600 });
  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
  const device = new SIM800(port)
  const task = new Task(port.path)

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
    await device.init()
    task.setTask('0 5 * * *', () => device.clearSMSMemory())

    if (process.env.NODE_ENV === 'production') sendToTelegram(chatId, '✅ Устройство подключено')
  });

  port.on('error', function(err) {
    console.log(`[${path}] Error: `, err.message)
  })

  port.on('close', function(err) {
    console.log(`[${path}] Отключен`)

    task.clearTasks()

    if (process.env.NODE_ENV === 'production') sendToTelegram(chatId, '❌ Устройство отключено')

    const client = clients.find((c) => c.chatId === chatId)

    if (!client) return

    findAndConnect(chatId, client.device)
  })

  return { port, chatId, path}
}
