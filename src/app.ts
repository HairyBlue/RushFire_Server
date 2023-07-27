import express, { Express, Request, Response, NextFunction } from "express";
import http from "http";
import ExpressError from "./utils/ExpressError";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import adminroute from "./router/admin";
import teamroute from "./router/team";
import citizenroute from "./router/citizen";
import { PrismaClient } from "@prisma/client";
import setupSocketIO from "./config/socket";
const app: Express = express();
const server = http.createServer(app);
const prisma = new PrismaClient();

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//methos for socket connection
setupSocketIO(server);

//Admin Route
app.use("/admin", adminroute);
app.use("/team", teamroute);
app.use("/user", citizenroute);

//THIS BLOCK OF CODE IS PURPOSE SOLE FOR DEBUGING >>>>
app.get("/admin-profile", async (req: Request, res: Response) => {
  console.time("time");
  const data = await prisma.admin.findMany();
  res.status(200).json({ result: data });
  console.timeEnd("time");
});
app.delete("/delete-admin", async (req: Request, res: Response) => {
  await prisma.admin.deleteMany();
  res.status(200).json({ success_message: "Deleted Admin" });
});
app.delete("/delete-reports", async (req: Request, res: Response) => {
  await prisma.report.deleteMany();
  res.status(200).json({ success_message: "Deleted reports" });
});
app.delete("/delete-alarms", async (req: Request, res: Response) => {
  await prisma.alarm.deleteMany();
  res.status(200).json({ success_message: "Deleted alarm" });
});
//DEBUG CODE ENDS HERE >>>>

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ExpressError(404, "Page not found"));
});
app.use(
  (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || 500;
    if (!err.message) err.message = "Oh no something went wrong";
    res.status(err.status).json({ error: err.message });
  }
);

const PORT = 5000;
server.listen(PORT, () => console.log(`listening on port ${PORT}`));
