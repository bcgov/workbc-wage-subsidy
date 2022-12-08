import * as express from "express"
import * as wageController from "../controllers/wage.controller"

const router = express.Router()

router.get("/wage", wageController.getAllWage)
router.post("/wage", wageController.createWage)

export default router
