import { SerialPort } from 'serialport'

export class SIM800 {
  port: SerialPort

  constructor(port: SerialPort) {
    this.port = port
  }

  async init() {
    await this.sendAT('AT');             // Проверка связи
    await this.sendAT('ATE0');           // Выключить эхо
    await this.sendAT('AT+CSCS="UCS2"'); // Ставим кодировку UCS2
    await this.sendAT('AT+CMGF=1');      // Текстовый режим
    await this.sendAT('AT+CNMI=2,2,0,0,0'); // Автоотправка входящих
    this.log('Готов к приему SMS')
  }

  async clearSMSMemory() {
    this.log('Очистка всех SMS...')
    for (let i = 1; i <= 50; i++) {
      await this.sendAT(`AT+CMGD=${i}`);
    }
    this.log('Список сообщений очищен')
  }

  private sendAT(command: string) {
    return new Promise((resolve) => {
      this.port.write(command + '\r');
      setTimeout(resolve, 300);
    });
  }

  log(message: string) {
    console.log(`[${this.port.path}] ${message}`);
  }

}
