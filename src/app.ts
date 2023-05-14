import express, {Express, Request, Response, NextFunction} from "express";
import ExpressError from "./utils/ExpressError"
import adminroute from "./router/admin";
const app: Express = express()

app.use(express.json());   
app.use(express.urlencoded({extended: true}));

//Admin Route
app.use("/admin", adminroute)

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new  ExpressError(404, "Page not found"))
})
app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || 500
    if (!err.message) err.message = "Oh no something went wrong"
    res.status(err.status).json({ error: err.message })
})
const PORT = 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`))