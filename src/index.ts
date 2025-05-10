import {findAndConnect} from "./utils/findAndConnect.ts";
import {clients} from "./utils/generateClients.ts";


console.log('[CLIENTS]', clients)

clients.map(({ chatId, device }) => findAndConnect(chatId, device))
