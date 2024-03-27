import express from "express";
import S321Controller from "../controllers/s321-controller.js";
import { AuthMiddleware } from "../middlewares/auth-middleware.js";

const router = new express.Router();

router.post("/", AuthMiddleware("admin"), S321Controller.setParameters);
router.get("/", AuthMiddleware("user"), S321Controller.getParameters);

export default router;
