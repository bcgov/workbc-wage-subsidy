import * as express from "express"
import * as wageController from "../controllers/wage.controller"

const router = express.Router()

router.get("/wage", wageController.getAllWage)
router.delete("/wage/:id", wageController.deleteWage)

export default router
