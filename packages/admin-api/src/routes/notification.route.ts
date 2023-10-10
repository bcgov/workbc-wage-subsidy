import * as express from "express"

import * as notificationController from "../controllers/notification.controller"

const router = express.Router()

router.get("/", notificationController.getNotification)
router.post("/", notificationController.addNotification)
router.delete("/", notificationController.deleteNotification)

export default router
