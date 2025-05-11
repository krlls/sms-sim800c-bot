import {clients} from "./utils/generateClients.ts";
import { Connection } from './module/Connection.ts'


console.log('[CLIENTS]', clients)

export const connections: Connection[] = clients.map(({ chatId, productId }) => new Connection(chatId, productId))

connections.forEach((connection)=> connection.init())
