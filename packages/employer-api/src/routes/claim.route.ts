import * as express from "express"
import * as claimController from "../controllers/claim.controller"

const router = express.Router()

router.get("/", claimController.getAllClaims)
router.post("/", claimController.createClaim)
router.get("/:id", claimController.getOneClaim)
router.put("/:id", claimController.updateClaim)
router.delete("/:id", claimController.deleteClaim)

export default router
