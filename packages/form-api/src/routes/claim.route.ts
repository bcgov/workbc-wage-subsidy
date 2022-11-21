import * as express from "express"
import * as claimController from "../controllers/claim.controller"

const router = express.Router()

router.post("/insertClaim", claimController.insertClaim)

export default router
