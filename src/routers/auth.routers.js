import express from "express";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-in", authController.signIn);
router.delete("/sign-out", authController.signOut);

router.post("/sign-up", authController.signUp);

export default router;
