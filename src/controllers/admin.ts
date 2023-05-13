import { Request, Response, NextFunction } from "express"
import CatchAsync from "../utils/CatchAsync"
import ExpressError from "../utils/ExpressError"

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

//Get 
const Profile =  CatchAsync(async(req: Request,res: Response) => {
    const profile = await prisma.admin.findUnique({
        where: {
            id: req.body.id
        }
    })

    res.status(200).json({
       data: profile
    })
})

//POST
const SignUp = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const count = await prisma.admin.count()
    if (count > 0) {
      return next(new ExpressError(400, "Admin account has already been created"))
    }
    const {name, birthyear, contact, email, username, password} = req.body
    await prisma.admin.create({
        data: {
            name: name,
            birthyear: birthyear,
            contact: contact,
            email: email,
            username: username,
            password: password
        }
    })
    res.status(200).json({
        succes_message: "Admin account has succesfully created"
    })
})


const Login = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const { usernameoremail, password } = req.body
    // const isusername = await prisma.admin.findUnique({
    //     where: {
    //         username: username
    //     }
    // })
   
    // if (!isusername) { return next(new ExpressError(400, "Invalid credendtials")) }

    const isusernameoremail = await prisma.admin.findMany({
        where: {
            OR: [
                { username: { equals: usernameoremail } },
                { email: {equals: usernameoremail} }
           ]
        }
    })
   
    if (isusernameoremail.length == 0) { return next(new ExpressError(400, "Invalid credendtials")) }
    const ispassword = await prisma.admin.findUnique({
        where: {
            password: password
        }
    })
    if (!ispassword) { return next(new ExpressError(400, "Invalid credendtials")) }
    res.status(200).json({
        succes_message: "You have succesfully login"
    })
})

export {
    //Get
    Profile,

    //POST
    SignUp,
    Login
}