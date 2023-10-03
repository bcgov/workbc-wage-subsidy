import * as express from "express"
import * as claimController from "../controllers/claim.controller"

const router = express.Router()

router.get("/", claimController.getAllClaims)
router.get("/counts", claimController.getClaimCounts)
router.get("/:id", claimController.getOneClaim)
router.put("/:id", claimController.updateClaim)
router.delete("/:id", claimController.deleteClaim)
router.get("/:id/file/:fileid", claimController.getFile)
router.get("/pdf/:id/:formType", claimController.generatePDF)

export default router
