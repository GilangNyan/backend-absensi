import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import User from "../models/userModel";
import { checkHash } from "../utils/crypt";
import { errorResponse } from "../utils/response";
import ExtendedRequest from "../types/extendedRequest";
import Employee from "../models/employeeModel";
import Role from "../models/roleModel";

export const checkUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    const {username, password} = req.body
    let user = await User.findOne({
        where: {
            username: username
        },
        include: [Employee, Role]
    })
    if (!user) {
        return errorResponse(res, 'Username Not Found', {}, 404)
    }
    if (checkHash(user.password, password)) {
        res.locals = user
        return next()
    } else {
        return errorResponse(res, 'Invalid Username or Password', {}, 400)
    }
}

export const validateToken = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ')
            if (authorization[0] !== 'Bearer') {
                return errorResponse(res, 'Unauthorized', {}, 401)
            } else {
                let secretKey: string = process.env.SECRET_KEY!
                let token = jwt.verify(authorization[1], secretKey)
                req.jwt = token
                return next()
            }
        } catch (error) {
            return errorResponse(res, 'Forbidden', error, 403)
        }
    } else {
        return errorResponse(res, 'Unauthorized', {}, 401)
    }
}