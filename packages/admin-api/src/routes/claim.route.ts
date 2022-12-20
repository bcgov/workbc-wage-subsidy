import * as express from "express"
import * as claimController from "../controllers/claim.controller"

const router = express.Router()

router.get("/claims", claimController.getAllClaims)
router.get("/claims/:id", claimController.getClaim)

export default router
