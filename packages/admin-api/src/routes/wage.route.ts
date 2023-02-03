import * as express from "express"
import * as wageController from "../controllers/wage.controller"

const router = express.Router()

router.get("/wage", wageController.getAllWage)
router.put("/wage/:id", wageController.updateWage)
router.delete("/wage/:id", wageController.deleteWage)
router.get("/wage/pdf/:id", wageController.generatePDF)

export default router
