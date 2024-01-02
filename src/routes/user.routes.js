import { Router } from "express";
import { registerUser } from "../controllers/users.controllers.js";
const router = new Router();

router.route("/register").post(registerUser);
// router.route("/login").post();
export default router;
