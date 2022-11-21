import * as express from "express"
import * as addressController from "../controllers/address.controller"

const router = express.Router()

router.post("/validateAddress", addressController.getAddressValidation)

export default router
