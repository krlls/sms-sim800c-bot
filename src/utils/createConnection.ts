import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import pdu  from 'node-sms-pdu'

import Message from "../module/Message.ts";
import {findAndConnect} from "./findAndConnect.ts";
import {clients } from "./generateClients.ts";
import { SIM800 } from '../module/SIM800.ts'
import { Task } from '../module/Task.ts'
import { formatPhone, sendToTelegram } from './sendToTelegram.ts'
import { isPDU } from './isPDU.ts'
import { DEBUG } from '../conf/env.ts'
import { getPhoneFromClip } from './getPhoneFromClip.ts'

export const createConnection = (chatId, path) => {
  const port = new SerialPort({ path, baudRate: 9600 });
  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
  const deviceName = port.path
  const message = new Message(deviceName, chatId)
  const device = new SIM800(deviceName, port)
  const task = new Task(deviceName)

  parser.on('data', async (line: string) => {
    if (DEBUG) console.log(`[DEBUG] [${deviceName}] ${line}`)

    if(line.startsWith('+CLIP')) {
      device.rejectCall()
      return sendToTelegram(chatId, formatPhone(getPhoneFromClip(line)))
    }

    if(line.startsWith('+CMTI:')) return device.requestMessage(line)

    if(isPDU(line)) {
      const sms = pdu.parse(line)

      message.setPhone(sms.origination)
      message.appendMessage(sms.text)

      if (!sms.concat || sms.concat.total <= message.messageBuffer.length) {
        message.sendToTelegram()
      }
      return
    }
  });

  port.on('open', async () => {
    console.log(`[${deviceName}] Порт открыт`);

    await device.init()
    task.setTask('0 5 * * *', () => device.clearSMSMemory())

    if (process.env.NODE_ENV === 'production') sendToTelegram(chatId, '✅ Устройство подключено')
  });

  port.on('error', function(err) {
    console.log(`[${deviceName}] Error: `, err.message)
  })

  port.on('close', () => {
    console.log(`[${deviceName}] Отключен`)

    task.clearTasks()

    if (process.env.NODE_ENV === 'production') sendToTelegram(chatId, '❌ Устройство отключено')

    const client = clients.find((c) => c.chatId === chatId)

    if (!client) return

    findAndConnect(chatId, client.device)
  })

  return { port, chatId, path}
}
