import * as express from "express"
import * as applicationController from "../controllers/application.controller"

const router = express.Router()

router.get("/", applicationController.getAllApplications)
router.post("/", applicationController.createApplication)
router.get("/:id", applicationController.getOneApplication)
router.put("/:id", applicationController.updateApplication)
router.delete("/:id", applicationController.deleteApplication)

export default router
