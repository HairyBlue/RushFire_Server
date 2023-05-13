import express, {Express, Request, Response, NextFunction} from "express";
import CutomeError from "./utils/ExpressError"
const app: Express = express()
import { SignUp, Profile, Login } from "./controllers/admin";

app.use(express.json());   
app.use(express.urlencoded({extended: true}));

//Tempprary router
app.get("/", async(req: Request, res: Response) => {
    res.json({data: "This is first path"})
})
app.get("/profile", Profile)
app.post("/signup", SignUp)
app.post("/login", Login)

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new  CutomeError(404, "Page not found"))
})

app.use((err: CutomeError, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || 500
    if (!err.message) err.message = "Oh no something went wrong"
    res.status(err.status).json({ error: err.message })
})

const PORT = 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`))