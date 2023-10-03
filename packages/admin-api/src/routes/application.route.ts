import * as express from "express"
import * as applicationController from "../controllers/application.controller"

const router = express.Router()

router.get("/", applicationController.getAllApplications)
router.get("/counts", applicationController.getApplicationCounts)
router.get("/:id", applicationController.getOneApplication)
router.put("/:id", applicationController.updateApplication)
router.delete("/:id", applicationController.deleteApplication)
router.get("/pdf/:id/:formType", applicationController.generatePDF)

export default router
