import S321Model from "../models/s321-model.js";
import { sendMsgS321 } from "../services/s321-service.js";

class S321Controller {
  async setParameter(req, res, next) {
    try {
      const { parameter, value } = req.body;
      const { system } = req.params;
      const result = await sendMsgS321(6, parameter, value, system);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
  async getParameter(req, res, next) {
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
      const { system, address, port, host, motor } = req.body;
      const result = await S321Model.create({ system, address, port, host, motor });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }
  async getMonitoringParameters(req, res, next) {
    try {
      const { system } = req.params;
      const parameters = { frequency: "d.00", voltage: "d.03", current: "d.04", rpm: "d.05" };
      const { motor } = await S321Model.findOne({ system });
      const result = { motor };
      for (const [key, value] of Object.entries(parameters)) {
        const s321Data = await sendMsgS321(3, value, "01", system);
        result[key] = s321Data;
      }
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export default new S321Controller();
