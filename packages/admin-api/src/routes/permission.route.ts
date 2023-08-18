import express from "express"
import * as permissionController from "../controllers/permission.controller"

const router = express.Router()

router.get("/", permissionController.getPermission)

export default router
