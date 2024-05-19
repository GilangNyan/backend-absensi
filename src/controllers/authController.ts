import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getConfigByKeyService } from "../services/configService";
import { errorResponse, successResponse } from "../utils/response";
import * as sequelize from "sequelize";
import { registerUserService } from "../services/authService";
import { getMenusByRole } from "../services/menuService";
import ExtendedRequest from "../types/extendedRequest";
import { getRecentAcademicYearService } from "../services/academicYearService";

export const register = async (req: Request, res: Response) => {
    const {email, username, password, confirmPassword, role} = req.body
    try {
        if (password !== confirmPassword) {
            return errorResponse(res, 'Password and Confirm Password Didn\'t Match', {}, 400)
        }
        const result = await registerUserService(email, username, password, role)
        return successResponse(res, result, 201)
    } catch (error: any) {
        if (error instanceof sequelize.ValidationError) {
            return errorResponse(res, error.message, error.errors, 400)
        } else if (error instanceof sequelize.UniqueConstraintError) {
            return errorResponse(res, error.message, error.errors, 409)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        let secretKey: string = process.env.SECRET_KEY!
        let loginExpire = await getConfigByKeyService('login-expire-time')
        let loginExpireMinutes = loginExpire.dataValues.value + 'm'
        let roleId = res.locals.dataValues.roleId
        let menus = await getMenusByRole(roleId)
        let academicYear = await getRecentAcademicYearService()
        // res.locals = Object.assign(res.locals, menus)
        let token = jwt.sign(res.locals.dataValues, secretKey, {expiresIn: loginExpireMinutes})
        let accessToken = {
            accessToken: token,
            menus: menus,
            academicYear: academicYear
        }
        return successResponse(res, accessToken)
    } catch (error) {
        return errorResponse(res, 'Login Failed', error)
    }
}

export const logout = async (req: ExtendedRequest, res: Response) => {
    try {
        // 
    } catch (error) {
        return errorResponse(res, 'Logout Failed', error)
    }
}