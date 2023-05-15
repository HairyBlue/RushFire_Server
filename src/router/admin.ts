import express, { Router } from "express"
import CatchAsync from "../utils/CatchAsync"
import { Profile } from "../controllers/admin"
import { SignUp, Login } from "../controllers/admin"
import verifyJWT  from "../middleware"
const router: Router = express.Router()

router.get("/profile", verifyJWT, CatchAsync(Profile))

router.post("/signup", CatchAsync(SignUp))
router.post("/login", CatchAsync(Login))

export default router;