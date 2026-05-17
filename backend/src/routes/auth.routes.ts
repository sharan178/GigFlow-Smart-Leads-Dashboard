import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateLogin, validateRegister } from "../middleware/validate.middleware";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", authenticate, me);

export default router;
