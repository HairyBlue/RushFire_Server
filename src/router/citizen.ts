import express, { Router } from "express"
import CatchAsync from "../utils/CatchAsync"
import verifyJWT from "../middleware"
import { PostReport } from "../controllers/team copy"
import multer from "multer"
//import { storage } from "../config/firebase"
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
const router: Router = express.Router()

router.post("/post-report", upload.array("image"), PostReport)
export default router