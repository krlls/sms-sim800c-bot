
import {SerialPort} from "serialport";
import {VENDOR} from "../conf/env.ts";

export const getDevicePatch = async (productId) => {
  const device = (await SerialPort.list()).find((d) => d.vendorId === VENDOR && d.productId === productId)
  return device?.path
}
