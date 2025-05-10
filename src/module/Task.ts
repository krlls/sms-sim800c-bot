import cron, { type ScheduledTask } from 'node-cron';

export class Task {
  name: string
  tasks: ScheduledTask[] = []

  constructor(name: string) {
    this.name = name
  }

  setTask(time: string, clb: VoidFunction) {
    const task = cron.schedule(time, clb);
    this.tasks.push(task)
    this.log(`Задача на ${time} добавлена`)
  }

  clearTasks() {
    this.tasks.forEach(async (task) => task.destroy())
    this.log(`Список задач очищен`)
  }

  private log(message: string) {
    console.log(`[${this.name}] ${message}`);
  }
}
