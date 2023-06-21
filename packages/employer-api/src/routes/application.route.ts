import * as express from "express"
import * as applicationController from "../controllers/application.controller"

const router = express.Router()

router.get("/application", applicationController.getAllApplications)
router.post("/application", applicationController.createApplication)
router.get("/application/:id", applicationController.getOneApplication)
router.put("/application/:id", applicationController.updateApplication)
router.delete("/application/:id", applicationController.deleteApplication)

export default router
