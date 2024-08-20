import ExtendedRequest from "../types/extendedRequest";
import * as sequelize from "sequelize";
import { errorResponse, successResponse } from "../utils/response";
import { Response } from "express";
import { createUserService, getUserById, updatePasswordService } from "../services/userService";
import { getRoleByNameService } from "../services/roleService";
import { createEmployeeService } from "../services/employeeService";
import { checkHash } from "../utils/crypt";

export const createSuperadminUser = async (req: ExtendedRequest, res: Response) => {
    try {
        let superadminRole = await getRoleByNameService('Superadmin')
        let roleId = superadminRole.id
        let user = await createUserService('superadmin', roleId)
        if (user) {
            let userDetail = await createEmployeeService('000', 'Super Admin', 'L', 'Tasikmalaya', '1997-10-18', user.dataValues.id)
            user = Object.assign(user, { detail: userDetail })
            return successResponse(res, user)
        }
    } catch (error: any) {
        if (error instanceof sequelize.ValidationError) {
            return errorResponse(res, error.message, error.errors, 400)
        } else if (error instanceof sequelize.UniqueConstraintError) {
            return errorResponse(res, error.message, error.errors, 409)
        } else if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const updatePasswordUser = async (req: ExtendedRequest, res: Response) => {
    let {oldPassword, newPassword} = req.body
    try {
        let token = req.jwt
        const user = await getUserById(token.id)
        if (checkHash(user.dataValues.password, oldPassword)) {
            const result = await updatePasswordService(user.dataValues.id, newPassword)
            return successResponse(res, result)
        } else {
            throw new Error('Old Password doesn\'t match')
        }
    } catch (error: any) {
        if (error instanceof sequelize.ValidationError) {
            return errorResponse(res, error.message, error.errors, 400)
        } else if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else if (error.message == 'Old Password doesn\'t match') {
            return errorResponse(res, error.message, error, 401)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}