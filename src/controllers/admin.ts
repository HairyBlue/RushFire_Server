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

//Get 
const Profile = async (req: Request, res: Response) => {
    const _id = (req as GetUserRequest).user
    const profile = await prisma.admin.findUnique({where: { id: _id}})
    res.status(200).json({
       data: profile
    })
}

//POST
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
    // const isusername = await prisma.admin.findUnique({where: {username: username}})
    // if (!isusername) { return next(new ExpressError(400, "Invalid credendtials")) }
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
    const access_token = jwt.sign({id: isexist[0]?.id }, process.env.ACCESS_TOKEN as Secret)
    res.status(200).json({succes_message: "You have succesfully login", id: isexist[0]?.id, token: access_token})
}


export {
    //Get
    Profile,

    //POST
    SignUp, 
    Login
}