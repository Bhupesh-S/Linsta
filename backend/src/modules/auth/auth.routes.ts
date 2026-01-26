// Auth routes
import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/google", AuthController.googleLogin);

// LinkedIn OAuth routes
router.get("/linkedin", AuthController.getLinkedinAuth);
router.get("/linkedin/callback", AuthController.linkedinCallback);

export default router;
