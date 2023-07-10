import { Request, Response, NextFunction } from "express"
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import ExpressError from "../utils/ExpressError"
import imageupload from "../config/imagetofirebase/citizen"

dotenv.config()
const prisma = new PrismaClient()

interface GetUserRequest extends Request {
    user: any
}

//GET REQUEST
const Profile = async (req: Request, res: Response, next: NextFunction) => {
    const id = (req as GetUserRequest).user
    const profile = await prisma.citizen.findUnique({where: { id: id}})
    res.status(200).json({
       results: profile
    })
}

//POST REQUEST
const SignUp = async (req: Request, res: Response, next: NextFunction) => {
    type Gender = "Male" | "Female" | "Rather not to say"
    const { name, birthyear, gender, contact, email, username, password } = req.body
    const hashedpwd = await bcrypt.hash(password, 10)
    const isGender: Gender = gender
    await prisma.citizen.create({
        data: {
            name: name,
            birthyear: birthyear,
            gender: isGender,
            contact: contact,
            email: email,
            username: username,
            password: hashedpwd
        }
    })
    res.status(200).json({
        succes_message: "Account has succesfully created"
    })
}
const Login = async (req: Request, res: Response, next: NextFunction) => {
    const { usernameoremail, password } = req.body
    const isexist = await prisma.citizen.findMany({
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
    const access_token = jwt.sign({id: isexist[0]?.id, role: "Citizen"}, process.env.ACCESS_TOKEN as string)

    res.status(200).json({succes_message: "You have succesfully login", token: access_token})
}
const PostReport = async(req: Request, res: Response, next: NextFunction) => {
    const {address, description} = req.body
    let mut: string[]= []
    const filesArray = req.files as Express.Multer.File[]
    const uploadPromise =  filesArray.map(async(file)=> {
        const originalname = file.originalname
        const buffer = file.buffer
        const {customFilePath, url}= await imageupload(originalname, buffer)
        mut.push(`${customFilePath} ${url}`)
    })
    await Promise.all(uploadPromise);
    await prisma.report.create({
        data: {
            address: address,
            description: description,
            image: JSON.stringify(mut),
            citizenID: "00dsdi"
        }
    })  
    res.status(200).json("HUmana")
}
//PUT
const UpdateProfile =async (req: Request, res: Response, next: NextFunction) => {
    const id = (req as GetUserRequest).user;
    const { name, birthyear, contact, email} = req.body
    
    await prisma.citizen.update({
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


export {
    //GET
    Profile,
    //POST
    SignUp, 
    Login,
    PostReport,
    //PUT
    UpdateProfile,
}