import * as express from "express"
import * as applicationController from "../controllers/application.controller"

const router = express.Router()

router.get("/", applicationController.getAllApplications)
router.get("/counts", applicationController.getApplicationCounts)
router.get("/:id", applicationController.getOneApplication)
router.post("/", applicationController.createApplication)
router.put("/share/:id", applicationController.shareApplication)
router.put("/mark/:id", applicationController.markApplication)
router.put("/sync", applicationController.syncApplications)
router.put("/:id", applicationController.updateApplication)
router.delete("/:id", applicationController.deleteApplication)

export default router
