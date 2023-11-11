import * as express from "express"
import * as employerController from "../controllers/employer.controller"

const router = express.Router()

router.get("/", employerController.getAllEmployers)
router.post("/", employerController.createEmployer)
router.post("/getOne", employerController.getOneEmployer)
router.put("/", employerController.updateEmployer)

export default router
