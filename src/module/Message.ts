import {formatSMS, sendToTelegram} from "../utils/sendToTelegram.ts";

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
    this.log('Сообщение принято')
  }

  sendToTelegram = () => {
    sendToTelegram(this.chatId, formatSMS(this.phone, this.messageBuffer.join('')))
    this.reset()
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
