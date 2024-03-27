import net from "net";
import S321Model from "../models/s321-model.js";
import { ApiError } from "../exceptions/api-error.js";

class S321 {
  constructor(address, mode, parameter, value) {
    this.address = address;
    this.mode = mode;
    this.parameter = parameter;
    this.value = value;
  }

  addressArray() {
    if (/^\d{1,3}$/.test(this.address) && parseInt(this.address) <= 247) {
      return (this.address = [parseInt(this.address)]);
    } else {
      throw ApiError.BadRequest("Wrong S321 address");
    }
  }

  modeArray() {
    if (/^[36]$/.test(this.mode)) {
      return (this.mode = [parseInt(this.mode)]);
    } else {
      throw ApiError.BadRequest("Wrong S321 mode");
    }
  }

  parameterArray(item) {
    let f = ["f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc"];
    if (/^f[\da-c]\.\d{2}$/i.test(item)) {
      item = item.toLowerCase().split(".");
      return [f.indexOf(item[0]), parseInt(item[1])];
    } else if (/^d\.\d{2}$/i.test(item)) {
      return [0x70, parseInt(item.split(".")[1])];
    } else if (/^[1-38]0{3}$/.test(item)) {
      return [parseInt(item.substring(0, 1), 16), 0x00];
    } else {
      throw ApiError.BadRequest("Wrong S321 parameter");
    }
  }

  valueArray(item) {
    if (/^\d{1,5}$/.test(item) && parseInt(item) <= 65535) {
      item = parseInt(item).toString(16);
      item = "0".repeat(4 - item.length) + item;
      item = item.match(/..?/g);
      return [parseInt(item[0], 16), parseInt(item[1], 16)];
    } else {
      throw ApiError.BadRequest("Wrong S321 value");
    }
  }

  static modbusCrc(msg) {
    let crc = 0xffff;
    let poly = 0xa001;
    for (let n in msg) {
      crc ^= msg[n];
      for (let i = 0; i < 8; i++) {
        if (crc & 1) {
          crc >>= 1;
          crc ^= poly;
        } else {
          crc >>= 1;
        }
      }
    }
    crc = crc.toString(16);
    crc = "0".repeat(4 - crc.length) + crc;
    crc = crc.match(/..?/g);
    return [parseInt(crc[1], 16), parseInt(crc[0], 16)];
  }
  get msgNum() {
    let msg = this.addressArray().concat(
      this.modeArray(),
      this.parameterArray(this.parameter),
      this.valueArray(this.value)
    );
    return msg.concat(this.constructor.modbusCrc(msg));
  }

  get msgStr() {
    let hex = "";
    this.msgNum.forEach((item) => {
      item = item.toString(16);
      hex += "0".repeat(2 - item.length) + item;
    });
    return hex;
  }

  set setMsg([address = this.address, mode = this.mode, parameter = this.parameter, value = this.value] = []) {
    this.address = address;
    this.mode = mode;
    this.parameter = parameter;
    this.value = value;
  }
}

const sendMsgS321 = async (mode, parameter, value, system) => {
  const s321Data = await S321Model.findOne({ system });
  const address = s321Data.address;
  const port = s321Data.port;
  const host = s321Data.host;

  const vfd = new S321(address, mode, parameter, value);
  const msgNum = vfd.msgNum;
  const msgStr = vfd.msgStr;

  const result = await new Promise((resolve, reject) => {
    const client = new net.Socket();
    client.connect(port, host, () => {
      client.write(Buffer.from(msgNum));
    });
    client.on("data", (data) => {
      client.destroy();
      resolve({ command: msgStr, response: data.toString("hex") });
    });
  });
  return result;
};

export { sendMsgS321 };
