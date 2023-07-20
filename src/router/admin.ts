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
    DeleteTeam,
    OverviewAlarm,
    ManageAlarmRequest,
    ViewEachDevice,
    TeamToCoAdmin,
    CoAdminToTeam,
    OverviewReport,
    ManageReportRequest,
    DeleteReport,
    GetAdmin
} from "../controllers/admin"
import verifyJWT from "../middleware"
const router: Router = express.Router()
//GET
router.get("/getadmin", CatchAsync(GetAdmin))
router.get("/profile", verifyJWT, CatchAsync(Profile))
router.get("/dashboard", CatchAsync(DashboardData))
router.get("/overview-device", CatchAsync(OverviewDevice))
router.get("/manage-device", CatchAsync(ManageDeviceRequest))
router.get("/overview-alarm", CatchAsync(OverviewAlarm))
router.get("/manage-alarm", CatchAsync(ManageAlarmRequest))
router.get("/view-each-device", CatchAsync(ViewEachDevice))
router.get("/overview-report", CatchAsync(OverviewReport))
router.get("/manage-report", CatchAsync(ManageReportRequest))
//POST
router.post("/signup", CatchAsync(SignUp))
router.post("/login", CatchAsync(Login))
router.post("/register-device", verifyJWT, CatchAsync(RegisterDevice))

//PUT
router.put("/profile", verifyJWT, CatchAsync(UpdateProfile))
router.put("/device/:id", verifyJWT, CatchAsync(UpdateDevice))

router.patch("/team-to-coadmin/:id", verifyJWT, CatchAsync(TeamToCoAdmin))
router.patch("/coadmin-to-team/:id", verifyJWT, CatchAsync(CoAdminToTeam))
//DELETE
router.delete("/device/:id", verifyJWT, CatchAsync(DeleteDevice))
router.delete("/alarm/:id", verifyJWT, CatchAsync(DeleteAlarm))
router.delete("/citizen/:id", verifyJWT, CatchAsync(DeleteCitizen))
router.delete("/report/:id", verifyJWT, CatchAsync(DeleteReport))
router.delete("/team/:id", verifyJWT, CatchAsync(DeleteTeam))
export default router;