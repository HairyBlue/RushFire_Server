import express, { Router } from "express"
import CatchAsync from "../utils/CatchAsync"
import { 
    DashboardData, 
    Profile, 
    SignUp, 
    Login, 
    RegisterDevice, 
    OverviewDevice,
    ManageDeviceRequest
} from "../controllers/admin"
import verifyJWT  from "../middleware"
const router: Router = express.Router()
//GET
router.get("/profile", verifyJWT, CatchAsync(Profile))
router.get("/dashboard", CatchAsync(DashboardData))
router.get("/overview-device", CatchAsync(OverviewDevice))
router.get("/manage-device", CatchAsync(ManageDeviceRequest))

//POST
router.post("/signup", CatchAsync(SignUp))
router.post("/login", CatchAsync(Login))
router.post("/register-device", verifyJWT, CatchAsync(RegisterDevice))
export default router;