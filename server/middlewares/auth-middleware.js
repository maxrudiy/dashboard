import { ApiError } from "../exceptions/api-error.js";
import TokenService from "../services/token-service.js";

const AuthMiddleware = (group) => (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || authorization.startsWith("Bearer")) {
      return next(ApiError.Unauthorized());
    }
    const accessToken = authorization.substring(7);
    if (!accessToken) {
      return next(ApiError.Unauthorized());
    }
    const payload = TokenService.verifyAccessToken(accessToken);
    if (!payload || !payload.groups.find((value) => value.group === group) || !payload.isActivated) {
      return next(ApiError.Unauthorized());
    }
    req.user = payload;
    return next();
  } catch (err) {
    return next(ApiError.Unauthorized());
  }
};

export { AuthMiddleware };
