import { ReadlineParser, SerialPort } from 'serialport'
import pdu  from 'node-sms-pdu'

import Message from "./Message.ts";
import { delay, findDevicePatch } from '../utils/findDevicePatch.ts'
import {clients } from "../utils/generateClients.ts";
import { SIM800 } from './SIM800.ts'
import { Task } from './Task.ts'
import { formatPhone, sendToTelegram } from '../utils/sendToTelegram.ts'
import { isPDU } from '../utils/isPDU.ts'
import { DEBUG } from '../conf/env.ts'
import { getPhoneFromClip } from '../utils/getPhoneFromClip.ts'

export class Connection {
  deviceName: string
  productId: string
  chatId: string;
  port: SerialPort;
  message: Message
  device: SIM800
  task: Task

  constructor(chatId: string, productId: string) {
    this.chatId = chatId
    this.productId = productId
  }

  async init() {
    const client = clients.find(({ chatId, productId }) => chatId === this.chatId && productId === this.productId)
    if (!client) return

    const patch = await findDevicePatch({ productId: client.productId, patch: client.patch })
    this.deviceName = patch

    this.connect(this.chatId, patch)
  }

  private connect(chatId: string, path: string) {
    this.port = new SerialPort({ path, baudRate: 9600 });
    const parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    this.message = new Message(this.deviceName, chatId)
    this.device = new SIM800(this.deviceName, this.port)
    this.task = new Task(this.deviceName)

    parser.on('data', this.onData)
    this.port.on('open', this.onOpen)
    this.port.on('error', this.onError)
    this.port.on('close', this.onClose)
  }

  private onData = async (line: string = '') =>  {
    if (DEBUG) console.log(`[DEBUG] [${this.deviceName}] ${line}`)

    if(line.startsWith('+CLIP')) {
      const phone = getPhoneFromClip(line)
      console.log(`[${this.deviceName}] Звонок с ${phone}`);
      await this.device.rejectCall()
      return sendToTelegram(this.chatId, formatPhone(phone))
    }

    if(line.startsWith('+CMTI:')) return this.device.requestMessage(line)

    if(isPDU(line)) {
      const sms = pdu.parse(line)

      this.message.setPhone(sms.origination)
      this.message.appendMessage(sms.text)

      if (!sms.concat || sms.concat.total <= this.message.messageBuffer.length) {
        this.message.sendToTelegram()
      }
      return
    }
  }

  private onOpen = async () => {
    console.log(`[${this.deviceName}] Порт открыт`);

    await this.device.init()
    this.task.setTask('0 5 * * *', () => this.device.clearSMSMemory())

    if (process.env.NODE_ENV === 'production') sendToTelegram(this.chatId, '✅ Устройство подключено')
  }

  private onError = async (err: { message?: string}) => {
    console.log(`[${this.deviceName}] Ошибка: `, err.message)
    console.log(`[${this.deviceName}] Попытка повторного подключения, ждем 10 сек...`)

    await delay(10000)

    this.port.destroy()
    await this.init()
  }

  private onClose = async () => {
    console.log(`[${this.deviceName}] Отключен`)

    this.task.clearTasks()
    this.port.destroy()

    if (process.env.NODE_ENV === 'production') sendToTelegram(this.chatId, '❌ Устройство отключено')

    await delay(1000)
    await this.init()
  }

}
