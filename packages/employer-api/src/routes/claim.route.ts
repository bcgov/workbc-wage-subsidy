import * as express from "express"
import * as claimController from "../controllers/claim.controller"

const router = express.Router()

router.get("/", claimController.getAllClaims)
router.get("/counts", claimController.getClaimCounts)
router.post("/", claimController.createClaim)
router.post("/legacy", claimController.createLegacyClaim)
router.get("/:id", claimController.getOneClaim)
router.put("/share/:id", claimController.shareClaim)
router.put("/mark/:id", claimController.markClaim)
router.put("/sync", claimController.syncClaims)
router.put("/:id", claimController.updateClaim)
router.delete("/:id", claimController.deleteClaim)

export default router
