import express from "express";
import S321Controller from "../controllers/s321-controller.js";
import { AuthMiddleware } from "../middlewares/auth-middleware.js";

const router = new express.Router();

router.post("/create", AuthMiddleware("admin"), S321Controller.createSystem);
router.post("/set/:system", AuthMiddleware("admin"), S321Controller.setParameters);
router.get("/get/:system", AuthMiddleware("admin"), S321Controller.getParameters);

export default router;
