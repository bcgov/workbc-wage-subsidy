import * as express from "express"
import * as emailController from "../controllers/email.controller"

const router = express.Router()

router.post("/email", emailController.sendEmail)

export default router
