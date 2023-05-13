import express, { Router } from "express"
import CatchAsync from "../utils/CatchAsync"
import { GetMany,Profile } from "../controllers/admin"
import { SignUp, Login } from "../controllers/admin"
const router: Router = express.Router()

router.get("/getmany", CatchAsync(GetMany))
router.get("/profile", CatchAsync(Profile))

router.post("/signup", CatchAsync(SignUp))
router.post("/login", CatchAsync(Login))

export default router;