import express, { Router } from "express"
import CatchAsync from "../utils/CatchAsync"
import verifyJWT from "../middleware"
import { Login, PostReport, Profile, SignUp } from "../controllers/citizen"
import multer from "multer"
//import { storage } from "../config/firebase"
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
const router: Router = express.Router()
router.get("/profile", verifyJWT, CatchAsync(Profile))

router.post("/signup", CatchAsync(SignUp))
router.post("/login", CatchAsync(Login))
router.post("/post-report", verifyJWT, upload.array("image"), PostReport)
export default router