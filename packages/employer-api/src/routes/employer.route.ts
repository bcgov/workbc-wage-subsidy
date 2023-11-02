import * as express from "express"
import * as employerController from "../controllers/employer.controller"

const router = express.Router()

router.get("/", employerController.getAllEmployers)
router.post("/", employerController.createEmployer)
router.post("/getOne", employerController.getOneEmployer)
router.put("/:id", employerController.updateEmployer)
router.patch("/:id", employerController.createOrUpdateEmployer)

export default router
