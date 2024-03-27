import { sendMsgS321 } from "../services/s321-service.js";

class S321Controller {
  async setParameters(req, res, next) {
    try {
      const { parameter, value, system } = req.body;
      const result = await sendMsgS321(6, parameter, value, system);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
  async getParameters(req, res, next) {
    try {
      const { parameter, value, system } = req.body;
      const result = await sendMsgS321(3, parameter, value, system);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export default new S321Controller();
