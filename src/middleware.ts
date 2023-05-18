import { Request, Response, NextFunction } from "express"
import ExpressError from "./utils/ExpressError"
import jwt, {Secret, JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

interface GetUserRequest extends Request {
    user?: string | JwtPayload
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("authorization");
    if (!authHeader) {
        next(new ExpressError(401, "ACCESS DENIED"))
    } else {
        const token = authHeader.split(' ')[1];
        const isverify = jwt.verify(
            token, process.env.ACCESS_TOKEN as Secret,
            (error, decode: any) => {
                if (error) {
                    next(new ExpressError(403, "Invalid Token"))
                } else {
                    (req as GetUserRequest).user = decode.id;
                    next();
                }
            }
        )
    }
}

// const verifyCoAdmin = (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = req.header("authorization");
//     if (!authHeader) {
//         next(new ExpressError(401, "ACCESS DENIED"))
//     } else {
//         const token = authHeader.split(' ')[1];
//         const isverify = jwt.verify(
//             token, process.env.ACCESS_TOKEN as Secret,
//             (error, decode: any) => {
//                 if (error) {
//                     next(new ExpressError(403, "Invalid Token"))
//                 } else {
//                     if(!Boolean(decode.isCoAdmin)) {
//                         next(new ExpressError(401, "ACCESS DENIED"))
//                     }
//                     (req as GetUserRequest).user = decode.id
//                     next();
//                 }
//             }
//         )
//     }
// }

export default verifyJWT;