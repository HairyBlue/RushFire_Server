import express, { Router } from "express"
import CatchAsync from "../utils/CatchAsync"
import { 
    DashboardData, 
    Profile, 
    SignUp, 
    Login, 
    RegisterDevice, 
    OverviewDevice,
    ManageDeviceRequest,
    UpdateProfile,
    UpdateDevice,
    DeleteDevice,
    DeleteAlarm,
    DeleteCitizen,
    OverviewAlarm,
    ManageAlarmRequest,
    OverviewReport,
    ManageReportRequest,
    DeleteReport
} from "../controllers/team"
import verifyJWT from "../middleware"

const router: Router = express.Router()
//GET
router.get("/profile", verifyJWT, CatchAsync(Profile))
router.get("/dashboard", CatchAsync(DashboardData))
router.get("/overview-device", CatchAsync(OverviewDevice))
router.get("/manage-device", CatchAsync(ManageDeviceRequest))
router.get("/overview-alarm", CatchAsync(OverviewAlarm))
router.get("/manage-alarm", CatchAsync(ManageAlarmRequest))
router.get("/overview-report", CatchAsync(OverviewReport))
router.get("/manage-report", CatchAsync(ManageReportRequest))

//POST
router.post("/signup", CatchAsync(SignUp))
router.post("/login", CatchAsync(Login))
router.post("/register-device", verifyJWT, CatchAsync(RegisterDevice))

//PUT
router.put("/profile", verifyJWT, CatchAsync(UpdateProfile))
router.put("/device", verifyJWT, CatchAsync(UpdateDevice))

//DELETE
router.delete("/device", verifyJWT, CatchAsync(DeleteDevice))
router.delete("/alarm", verifyJWT, CatchAsync(DeleteAlarm))
router.delete("/report", verifyJWT, CatchAsync(DeleteReport))
router.delete("/citizen", verifyJWT, CatchAsync(DeleteCitizen))
export default router;