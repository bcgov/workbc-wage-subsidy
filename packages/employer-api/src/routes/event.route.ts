import * as express from "express"
import * as eventController from "../controllers/event.controller"

const router = express.Router()

router.post("/:formType", eventController.submission)

export default router
