import * as express from "express"
import * as wageController from "../controllers/wage.controller"

const router = express.Router()

router.post("/insertWage", wageController.insertWage)

export default router
