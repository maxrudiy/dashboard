import AuthController from "../controllers/auth-controller.js";
import express from "express";

const router = new express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/activate/:link", AuthController.activate);
router.get("/refresh", AuthController.refresh);
router.get("/users", AuthController.getUsers);

export default router;
