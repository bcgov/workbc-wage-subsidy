import * as express from "express"
import * as wageController from "../controllers/wage.controller"

const router = express.Router()

router.get("/insertWage", wageController.insertWage)

export default router
