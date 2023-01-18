import express from "express"
import * as permissionController from "../controllers/permission.controller"

const router = express.Router()

router.get("/permission", permissionController.getPermission)

export default router
