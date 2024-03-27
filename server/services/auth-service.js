import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { UserDTO } from "../dtos/user-dto.js";
import { ApiError } from "../exceptions/api-error.js";
import UserModel from "../models/user-model.js";
import TokenService from "./token-service.js";
import MailService from "./mail-service.js";

class AuthService {
  async register(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`User with ${email} already registered`);
    }
    const passHash = await bcrypt.hash(password, 3);
    const activationLink = v4();
    const userData = await UserModel.create({
      email,
      password: passHash,
      activationLink,
    });
    const userDto = new UserDTO(userData);
    const tokens = TokenService.createToken(userDto);
    await TokenService.saveToken(userDto.userId, tokens.refreshToken);
    MailService.sendActivationMail(email, `${process.env.SERVER_URL}/auth/activate/${activationLink}`);
    return {
      tokens,
      user: userDto,
    };
  }
  async login(email, password) {
    const userData = await UserModel.findOne({ email });
    if (!userData) {
      throw ApiError.BadRequest(`User with ${email} not registered`);
    }
    const passIsValid = await bcrypt.compare(password, userData.password);
    if (!passIsValid) {
      throw ApiError.BadRequest("Wrong password");
    }
    const userDto = new UserDTO(userData);
    const tokens = TokenService.createToken(userDto);
    await TokenService.saveToken(userDto.userId, tokens.refreshToken);
    return {
      tokens,
      user: userDto,
    };
  }
  async logout(refreshToken) {
    return await TokenService.deleteToken(refreshToken);
  }
  async activate(activationLink) {
    const userData = await UserModel.findOne({ activationLink });
    if (!userData) {
      throw ApiError.BadRequest("Wrong activation link");
    }
    userData.isActivated = true;
    return await userData.save();
  }
  async refresh(refreshToken) {
    const tokenData = await TokenService.findToken(refreshToken);
    const payload = TokenService.verifyRefreshToken(refreshToken);
    if (!tokenData || !payload || tokenData.userId.id !== payload.userId) {
      throw ApiError.BadRequest("Wrong token");
    }
    const userDto = new UserDTO(tokenData.userId);
    const tokens = TokenService.createToken(userDto);
    await TokenService.saveToken(userDto.userId, tokens.refreshToken);
    return {
      tokens,
      user: userDto,
    };
  }
}

export default new AuthService();
