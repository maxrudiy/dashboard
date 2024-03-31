import express from "express";
import S321Controller from "../controllers/s321-controller.js";
import { AuthMiddleware } from "../middlewares/auth-middleware.js";

const router = new express.Router();

router.post("/create", AuthMiddleware("admin"), S321Controller.createSystem);
router.post("/set/:system", AuthMiddleware("admin"), S321Controller.setParameter);
router.get("/get/:system", AuthMiddleware("admin"), S321Controller.getParameter);
router.get("/get/monitoring/:system", AuthMiddleware("admin"), S321Controller.getMonitoringParameters);

export default router;
