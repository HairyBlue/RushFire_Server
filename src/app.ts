import express, { Express, Request, Response, NextFunction } from "express";
import http from "http"
import ExpressError from "./utils/ExpressError"
import compression from "compression"
import helmet from "helmet"
import cors from "cors"
import adminroute from "./router/admin"
import citizenroute from "./router/citizen"
import { PrismaClient } from '@prisma/client'
const app: Express = express()
const server = http.createServer(app)
const prisma = new PrismaClient()

// app.disable('x-powered-by');
app.use(helmet())
app.use(compression())
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use(express.json());   
app.use(express.urlencoded({ extended: true }));

//Admin Route
app.use("/admin", adminroute)
app.use("/user", citizenroute)
app.delete("/delete-admin",async (req: Request, res: Response) => {
    await prisma.admin.deleteMany()
    res.status(200).json({success_message: "Deleted Admin"})
})
app.delete("/delete-reports",async (req: Request, res: Response) => {
    await prisma.report.deleteMany()
    res.status(200).json({success_message: "Deleted reports"})
})
app.get("/admin-profile", async (req: Request, res: Response) => {
    console.time('time')
   const data = await prisma.admin.findMany()
    res.status(200).json({ result: data })
    console.timeEnd('time')
})
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new  ExpressError(404, "Page not found"))
})
app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || 500
    if (!err.message) err.message = "Oh no something went wrong"
    res.status(err.status).json({ error: err.message })
})
const PORT = 3000;
server.listen(PORT, () => console.log(`listening on port ${PORT}`))