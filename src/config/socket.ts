import {Server, Socket} from "socket.io"
import http from "http"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const setupSocketIO = (server: http.Server)=> {
    const io = new Server(server)

    io.of("/alarm").on("connection", (socket: Socket)=>{
        socket.on("alarm", async (data)=> {
            await alarmPost(data)
            console.log(`Alarm send send by serial: ${data}`)
            
        })
    })
    io.of("/report").on("connection", (socket: Socket)=>{
        socket.on("report", ()=> {
            console.log("Report Send")
        })
    })
}

async function alarmPost(serial: any){
    await prisma.alarm.create({
        data: {
            serial: serial
        }
    })
}

export default setupSocketIO;