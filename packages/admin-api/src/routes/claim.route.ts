import * as express from "express"
import * as claimController from "../controllers/claim.controller"

const router = express.Router()

router.get("/claims", claimController.getAllClaims)

export default router
