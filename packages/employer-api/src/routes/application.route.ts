import * as express from "express"
import * as applicationController from "../controllers/application.controller"

const router = express.Router()

router.get("/", applicationController.getAllApplications)
router.get("/counts", applicationController.getApplicationCounts)
router.post("/", applicationController.createApplication)
router.get("/:id", applicationController.getOneApplication)
router.put("/:id", applicationController.updateApplication)
router.put("/share/:id", applicationController.shareApplication)
router.delete("/:id", applicationController.deleteApplication)

export default router
