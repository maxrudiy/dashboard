import { ApiError } from "../exceptions/api-error.js";
import UserModel from "../models/user-model.js";
import AuthService from "../services/auth-service.js";
import { validationResult } from "express-validator";

class AuthController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Wrong password or email", errors.array()));
      }
      const { password, email } = req.body;
      const userData = await AuthService.register(email, password);
      res.cookie("refreshToken", userData.tokens.refreshToken, {
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (err) {
      return next(err);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await AuthService.login(email, password);
      res.cookie("refreshToken", userData.tokens.refreshToken, {
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (err) {
      return next(err);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const result = await AuthService.logout(refreshToken);
      res.clearCookie("refreshToken", {
        path: "/",
        sameSite: "none",
        secure: true,
        httpOnly: true,
      });
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }
  async activate(req, res, next) {
    try {
      const { link } = req.params;
      await AuthService.activate(link);
      return res.redirect(301, process.env.CLIENT_URL);
    } catch (err) {
      return next(err);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await AuthService.refresh(refreshToken);
      res.cookie("refreshToken", userData.tokens.refreshToken, {
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (err) {
      return next(err);
    }
  }
  async getUsers(req, res, next) {
    try {
      const users = await UserModel.find();
      return res.json(users);
    } catch (err) {
      return next(err);
    }
  }
}

export default new AuthController();
