import * as express from "express"
import * as employerController from "../controllers/employer.controller"

const router = express.Router()

router.get("/getEmployerInfo/:id", employerController.getOneEmployer)

export default router
