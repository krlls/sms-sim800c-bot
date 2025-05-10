import {formatSMS, sendToTelegram} from "../utils/sendToTelegram.ts";
import { isLatinCharactersOnly } from '../utils/isLatinCharactersOnly.ts'

export default class Message {
  name: string
  messageBuffer: string[] = []
  chatId = ''
  phone = ''
  timerId = null
  waitPartTime = 15000

  constructor(name: string, chatId: string) {
    this.name = name
    this.chatId = chatId
  }

  setPhone(phone) {

    if (phone !== this.phone) {
      this.reset()
      this.phone = phone
      return
    }

    this.phone = phone
    this.stopSending()
  }

  appendMessage(message) {
    this.messageBuffer.push(message)
  }

  sendToTelegram = () => {
    const send = () => {
      sendToTelegram(this.chatId, formatSMS(this.phone, this.messageBuffer.join('')))
      this.reset()
    }

    const lastStr = this.messageBuffer.at(-1)
    const limit = isLatinCharactersOnly(lastStr) ? 150 : 67

    if (lastStr.length < limit) {
      this.log('Сообщение принято')
      this.stopSending()
      send()
      return
    }


    this.log(`Сообщение принято, ждем ${this.waitPartTime / 1000} сек`)
    this.timerId = setTimeout(send, this.waitPartTime)
  }

  stopSending() {
    clearTimeout(this.timerId)
    this.timerId = null
  }

  reset() {
    this.phone = ''
    this.messageBuffer = []
    this.timerId = null
  }

  private log(message: string) {
    console.log(`[${this.name}] ${message}`)
  }
}
