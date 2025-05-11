import {clients} from "./utils/generateClients.ts";
import { Connection } from './module/Connection.ts'


console.log('[CLIENTS]', clients)

export const connections: Connection[] = clients.map(({ chatId }) => new Connection(chatId))

connections.forEach((connection)=> connection.init())
