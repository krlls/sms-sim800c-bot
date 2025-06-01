
import {SerialPort} from "serialport";
import {VENDOR} from "../conf/env.ts";

export const checkDevicePatch = async (productId: string, patch: string) => {
  const device = (await SerialPort.list()).find((d) => d.vendorId === VENDOR && d.productId === productId && d.path === patch)
  return device?.path
}
