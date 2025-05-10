import {formatSMS, sendToTelegram} from "../utils/sendToTelegram.ts";

export default class Message {
  chatId = ''
  phone = ''
  message = ''
  timerId = null

  constructor(chatId) {
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
    this.message += message
  }

  sendToTelegram = () => {
    this.timerId = setTimeout(() => {
      sendToTelegram(this.chatId, formatSMS(this.phone, this.message))
      this.reset()
    }, 15000)
  }

  stopSending() {
    clearTimeout(this.timerId)
  }

  reset() {
    this.phone = ''
    this.message = ''
    this.timerId = null
  }
}
