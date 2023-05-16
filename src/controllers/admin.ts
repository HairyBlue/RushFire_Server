import { Request, Response, NextFunction } from "express"
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"
import jwt, {Secret} from "jsonwebtoken"
import dotenv from "dotenv"
import ExpressError from "../utils/ExpressError"
dotenv.config()
const prisma = new PrismaClient()

interface GetUserRequest extends Request {
    user: any
}

//GET REQUEST
const Profile = async (req: Request, res: Response, next: NextFunction) => {
    const id = (req as GetUserRequest).user
    const profile = await prisma.admin.findUnique({where: { id: id}})
    res.status(200).json({
       results: profile
    })
}
//Dashboard Multiple Data/Queuery Request
const DashboardData =async (req: Request, res: Response, next: NextFunction) => {
    const [alarmPost, alarmTake10, alarmCount] = await prisma.$transaction(
        [
            prisma.alarm.findMany({orderBy: {datetime: "asc"}}),
            prisma.alarm.findMany({take: 10, orderBy: {datetime: "desc"}}),
            prisma.alarm.count()
        ]
    )
    const [reportPost, reportTake10, reportCount] = await prisma.$transaction(
        [
            prisma.report.findMany({orderBy: {datetime: "asc"}}),
            prisma.report.findMany({take: 10, orderBy: {datetime: "desc"}}),
            prisma.report.count()
        ]
    )
    res.status(200).json({
        results:{
            alarm:{
                alarmPost: alarmPost,
                alarmTake10: alarmTake10,
                alarmCount: alarmCount
            },
            report: {
                reportPost: reportPost,
                reportTake10: reportTake10,
                reportCount: reportCount
            }
        }
    })
}
//Device
const OverviewDevice =async (req: Request, res: Response, next: NextFunction) => {
    const {page, iscurrent, year}= req.query
    const perPage = 20
    const toSkip = (parseInt(page as string) - 1) * perPage as number
    const [devicePost, deviceTake20, deviceCount] = await prisma.$transaction(
        [
            prisma.device.findMany({orderBy: {createdAt: "asc"}, select: {createdAt: true}}),
            prisma.device.findMany({skip: toSkip,take: perPage, orderBy: {createdAt: "desc"}}),
            prisma.device.count()
        ]
    )
    const pageCount = Math.ceil(deviceCount/perPage)

    res.status(200).json({
        retults: {
            devicePost: devicePost, 
            deviceTake20: deviceTake20, 
            deviceCount: deviceCount, 
            pageCount: pageCount
        }})
}
const ManageDeviceRequest =async (req: Request, res: Response, next: NextFunction) => {
    const {page, order} = req.query;
    const perPage = 20
    const toSkip = (parseInt(page as string) - 1) * perPage
    let devicePost;
    //default order -> desc
    if(order == "desc"){
         devicePost = await prisma.device.findMany({skip: toSkip,take: perPage, orderBy: {createdAt: "desc"}})
    }
     if(order == "asc"){
         devicePost = await prisma.device.findMany({skip: toSkip,take: perPage, orderBy: {createdAt: "asc"}})
    }
    const deviceCount = await prisma.device.count()
    const pageCount = Math.ceil(deviceCount/perPage)
    res.status(200).json({
        retults: {
            devicePost: devicePost, 
            deviceCount: deviceCount, 
            pageCount: pageCount
        }})
}

//Alarm
const OverviewAlarm =async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page;
    const perPage = 20
    const toSkip = (parseInt(page as string) - 1) * perPage
    const [alarmPost, alarmTake20, alarmCount] = await prisma.$transaction(
        [
            prisma.alarm.findMany({orderBy: {datetime: "asc"}}),
            prisma.alarm.findMany({skip: toSkip,take: perPage, orderBy: {datetime: "desc"}}),
            prisma.alarm.count()
        ]
    )
    const pageCount = Math.ceil(alarmCount/perPage)
    res.status(200).json({
        retults: {
            alarmPost: alarmPost, 
            alarmTake20: alarmTake20, 
            alarmCount: alarmCount, 
            pageCount: pageCount
        }})
}
const ManageAlarmRequest =async (req: Request, res: Response, next: NextFunction) => {
    const {page, order} = req.query;
    const perPage = 20
    const toSkip = (parseInt(page as string) - 1) * perPage
    let alarmPost;
    //default order -> desc
    if(order == "desc"){
         alarmPost = await prisma.alarm.findMany({skip: toSkip,take: perPage, orderBy: {datetime: "desc"}})
    }
    if(order == "asc"){
         alarmPost = await prisma.alarm.findMany({skip: toSkip,take: perPage, orderBy: {datetime: "asc"}})
    }
   
    const alarmCount = await prisma.alarm.count()
    const pageCount = Math.ceil(alarmCount/perPage)
    res.status(200).json({
        retults: {
            alarmPost: alarmPost, 
            alarmCount: alarmCount, 
            pageCount: pageCount
        }})
}

const Citizen =async (req: Request, res: Response, next: NextFunction) => {
    const {page, order} = req.query as any;
    const perPage = 20
    const toSkip = (parseInt(page) - 1) * perPage
    let citizenPost;
    //default order -> desc
    if(order == "desc"){
         citizenPost = await prisma.citizen.findMany({skip: toSkip,take: perPage, orderBy: {createdAt: "desc"}})
    }
   if(order == "asc"){
        citizenPost = await prisma.citizen.findMany({skip: toSkip,take: perPage, orderBy: {createdAt: "asc"}})
   }
    const citizenCount = await prisma.citizen.count()
    const pageCount = Math.ceil(citizenCount/perPage)
    res.status(200).json({
        retults: {
            citizenPost: citizenPost, 
            citizenCount: citizenCount, 
            pageCount: pageCount
        }})
}
const Team =async (req: Request, res: Response, next: NextFunction) => {
    const {page, order} = req.query as any;
    const perPage = 20
    const toSkip = (parseInt(page) - 1) * perPage
    let teamPost;
    //default order -> desc
    if(order == "desc"){
         teamPost = await prisma.team.findMany({skip: toSkip,take: perPage, orderBy: {createdAt: "desc"}})
    }
   if(order == "asc"){
        teamPost = await prisma.team.findMany({skip: toSkip,take: perPage, orderBy: {createdAt: "asc"}})
   }
    const teamCount = await prisma.citizen.count()
    const pageCount = Math.ceil(teamCount/perPage)
    res.status(200).json({
        retults: {
            citizenPost: teamPost, 
            citizenCount: teamCount, 
            pageCount: pageCount
        }})
}
//POST REQUEST
const SignUp = async (req: Request, res: Response, next: NextFunction) => {
    const count = await prisma.admin.count()
    if (count > 0) {return next(new ExpressError(400, "Admin account has already been created"))}
    const { name, birthyear, contact, email, username, password } = req.body
    const hashedpwd = await bcrypt.hash(password, 10)
    await prisma.admin.create({
        data: {
            name: name,
            birthyear: birthyear,
            contact: contact,
            email: email,
            username: username,
            password: hashedpwd
        }
    })
    res.status(200).json({
        succes_message: "Admin account has succesfully created"
    })
}
const Login = async (req: Request, res: Response, next: NextFunction) => {
    const { usernameoremail, password } = req.body
    const isexist = await prisma.admin.findMany({
        where: {
            OR: [
                { username: { equals: usernameoremail } },
                { email: {equals: usernameoremail} }
           ]
        }
    })
    if (isexist.length == 0) { return next(new ExpressError(400, "Invalid credendtials")) }
    const ispassword = await bcrypt.compare(password, isexist[0]?.password)
    if (!ispassword) { return next(new ExpressError(400, "Invalid credendtials")) }
    const access_token = jwt.sign({id: isexist[0]?.id }, process.env.ACCESS_TOKEN as string)

    res.status(200).json({succes_message: "You have succesfully login", id: isexist[0]?.id, token: access_token})
}

const RegisterDevice = async (req: Request, res: Response, next: NextFunction) => {
    const {serial, address, coords} = req.body
    const isexist = await prisma.device.findUnique({where: {serial: serial}})
    if(isexist){
        return next(new ExpressError(400, "Device already register"))
    }
    await prisma.device.create({
        data: {
            serial: serial,
            address: address,
            coords: coords
        }
    })
    res.status(200).json({success_message: "Succesfully register a device"})
}
//PUT
const UpdateProfile =async (req: Request, res: Response, next: NextFunction) => {
    const id = (req as GetUserRequest).user;
    const { name, birthyear, contact, email} = req.body
    
    await prisma.admin.update({
        where: {
            id: id
        },
        data: {
            name: name,
            birthyear: birthyear,
            contact: contact,
            email: email
        }
    })
    res.status(200).json({success_message: "Successfully update profile"})
}
const UpdateDevice = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const {serial,address, coords} = req.body
    await prisma.device.update({
        where: {
            id: id
        },
        data: {
            serial: serial,
            address: address,
            coords: coords
        }
    })
}
//DELETE
const DeleteDevice = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    await prisma.device.delete({where: {id: id}})
    res.status(200).json({success_message: "Succesfully deleted the device"})
}
const DeleteAlarm = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    await prisma.alarm.delete({where: {id: id}})
    res.status(200).json({success_message: "Succesfully deleted an alarm"})
}
const DeleteCitizen =async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    await prisma.citizen.delete({where: {id: id}})
    res.status(200).json({success_message: "Succesfully deleted an citizen account"})
}
const DeleteTeam =async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    await prisma.team.delete({where: {id: id}})
    res.status(200).json({success_message: "Succesfully deleted an team account"})
}

export {
    //GET
    Profile,
    DashboardData,
    OverviewAlarm,
    ManageAlarmRequest,
    OverviewDevice,
    ManageDeviceRequest,
    Citizen,
    Team,
    //POST
    SignUp, 
    Login,
    RegisterDevice,
    //PUT
    UpdateProfile,
    UpdateDevice,
    //DELETE
    DeleteDevice,
    DeleteAlarm,
    DeleteCitizen,
    DeleteTeam
}