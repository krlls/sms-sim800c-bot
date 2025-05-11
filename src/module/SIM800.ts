import { SerialPort } from 'serialport'

export class SIM800 {
  name: string
  port: SerialPort

  constructor(name: string, port: SerialPort) {
    this.name = name
    this.port = port
  }

  async init() {
    await this.sendAT('AT');             // Проверка связи
    await this.sendAT('ATE0');           // Выключить эхо
    await this.sendAT('AT+CSCS="UCS2"'); // Ставим кодировку UCS2
    await this.sendAT('AT+CMGF=0');      // Текстовый режим
    await this.sendAT('AT+CNMI=2,1,0,0,0'); // Автоотправка входящих
    this.log('Готов к приему SMS')
  }

  async clearSMSMemory() {
    this.log('Очистка всех SMS...')
    for (let i = 1; i <= 50; i++) {
      await this.sendAT(`AT+CMGD=${i}`);
    }
    this.log('Список сообщений очищен')
  }

  async requestMessage(smti: string) {
    await this.sendAT(`AT+CMGR=${smti.split(',')[1]}`)
  }

  private sendAT(command: string) {
    return new Promise((resolve) => {
      this.port.write(command + '\r');
      setTimeout(resolve, 300);
    });
  }

  private log(message: string) {
    console.log(`[${this.name}] ${message}`);
  }

}
