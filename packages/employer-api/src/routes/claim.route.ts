import * as express from "express"
import * as claimController from "../controllers/claim.controller"

const router = express.Router()

router.get("/", claimController.getAllClaims)
router.get("/counts", claimController.getClaimCounts)
router.post("/", claimController.createClaim)
router.get("/:id", claimController.getOneClaim)
router.put("/:id", claimController.updateClaim)
router.put("/share/:id", claimController.shareClaim)
router.delete("/:id", claimController.deleteClaim)

export default router
