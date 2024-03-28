import S321Model from "../models/s321-model.js";
import { sendMsgS321 } from "../services/s321-service.js";

class S321Controller {
  async setParameters(req, res, next) {
    try {
      const { parameter, value } = req.body;
      const { system } = req.params;
      const result = await sendMsgS321(6, parameter, value, system);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
  async getParameters(req, res, next) {
    try {
      const { parameter, value } = req.query;
      const { system } = req.params;
      const result = await sendMsgS321(3, parameter, value, system);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
  async createSystem(req, res, next) {
    try {
      const { system, address, port, host } = req.body;
      const s321Data = await S321Model.create({ system, address, port, host });
      return res.json(s321Data);
    } catch (err) {
      next(err);
    }
  }
}

export default new S321Controller();
