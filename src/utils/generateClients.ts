import {CLIENTS} from "../conf/env.ts";

export const clients =  CLIENTS.split(';').map((c) => ({ chatId: c.split(':')[0], device: c.split(':')[1].toString()}))
