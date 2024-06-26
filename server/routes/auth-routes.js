import AuthController from "../controllers/auth-controller.js";
import express from "express";
import { body } from "express-validator";
import { AuthMiddleware } from "../middlewares/auth-middleware.js";

const router = new express.Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("password")
    .isLength({ min: 3, max: 16 })
    .matches(/[a-zA-Z0-9]/),
  AuthController.register
);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/activate/:link", AuthController.activate);
router.get("/refresh", AuthController.refresh);
router.get("/users", AuthMiddleware("admin"), AuthController.getUsers);

export default router;
