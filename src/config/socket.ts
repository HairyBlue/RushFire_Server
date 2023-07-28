import {Server, Socket} from "socket.io"
import http from "http"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const setupSocketIO = (server: http.Server)=> {
    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    })

    io.of("/alarm").on("connection", (socket: Socket)=>{
        socket.on("alarm", async ({ model, type, serial, deviceId }) => {
            await alarmPost(model, type, serial, deviceId)
            console.log(`Alarm send send by a device serial number: ${serial}`)
            socket.emit("alarm_send")
        })
    })
    io.of("/report").on("connection", (socket: Socket)=>{
        socket.on("report", (data)=> {
            console.log(`Report Send by a citizen that has an id of -> ${data}`)
            socket.emit("report_send", data)
        })
    })
}

async function alarmPost(model:any, type:any, serial: any, deviceId: any){
    await prisma.alarm.create({
        data: {
            model: model,
            type: type,
            serial: serial,
            deviceId: deviceId
        }
    })
}

export default setupSocketIO;