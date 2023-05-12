import express, {Express, Request, Response, NextFunction} from "express";
import CutomeError from "./utils/CustomeError"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const app: Express = express()

async function main() {
  await prisma.admin.create({
        data: {
            name: "This is me"
      }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


app.get("/", async(req: Request, res: Response) => {
    const name = await prisma.admin.findMany()
    res.json({data: name})
})

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