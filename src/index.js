import 'dotenv/config'
import {findAndConnect} from "./utils/findAndConnect.js";
import {clients} from "./utils/generateClients.js";


console.log('[CLIENTS]', clients)

clients.map(({ chatId, device }) => findAndConnect(chatId, device))
