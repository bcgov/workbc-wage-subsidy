import * as express from "express"
import * as addressController from "../controllers/address.controller"

const router = express.Router()

router.post("/validate", addressController.getAddressValidation)
router.post("/nearestCentres", addressController.getNearestCentres)
router.post("/allCentres", addressController.getAllCentres)

export default router
