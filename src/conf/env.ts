import {protectEnv} from "../utils/protectEnv.ts";

export const TELEGRAM_TOKEN = protectEnv(process.env.TELEGRAM_BOT_TOKEN,'TELEGRAM_BOT_TOKEN')
export const CLIENTS = protectEnv(process.env.CLIENTS,'CLIENTS')

export const VENDOR = '1a86'
