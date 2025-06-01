import {CLIENTS} from "../conf/env.ts";

export const clients =  CLIENTS.split(';').map((c) => {
  const client = c.split(':')

  return ({ chatId: client[0], productId: client[1].toString(), patch: client[2]})
})
