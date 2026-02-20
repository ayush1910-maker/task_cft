import express from "express"
import { login, refresh_token, register_user } from "../controller/user.controller.js"
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const router = express.Router()

router.post("/register" , register_user)

router.post("/login" , login);

router.post("/refresh-token" , refresh_token)

export default router;
