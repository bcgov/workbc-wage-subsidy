import * as express from "express"
import * as claimController from "../controllers/claim.controller"

const router = express.Router()

router.get("/claims", claimController.getAllClaims)
router.post("/claims", claimController.createClaim)
router.get("/claims/:id", claimController.getOneClaim)
router.put("/claims/:id", claimController.updateClaim)
router.delete("/claims/:id", claimController.deleteClaim)

export default router
