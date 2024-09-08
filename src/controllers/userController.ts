import ExtendedRequest from "../types/extendedRequest";
import * as sequelize from "sequelize";
import { errorResponse, successResponse } from "../utils/response";
import { Response } from "express";
import { createUserService, deleteUserService, getUserById, getUserService, updatePasswordService, updateUserService } from "../services/userService";
import { getRoleByNameService } from "../services/roleService";
import { createEmployeeService, updateEmployeeService } from "../services/employeeService";
import { checkHash } from "../utils/crypt";
import { getRandomString } from "../utils/utility";

export const getUsers = async (req: ExtendedRequest, res: Response) => {
    const { page, perPage, id, search } = req.query
    try {
        if (id) {
            const user = await getUserById(id)
            return successResponse(res, user)
        } else {
            let offset: number = parseInt(page) || 1
            let limit: number = parseInt(perPage) || 10
            let filterSearch: string = search || ''
            const users = await getUserService(limit, offset, filterSearch)
            return successResponse(res, users)
        }
    } catch (error: any) {
        if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const createUser = async (req: ExtendedRequest, res: Response) => {
    try {
        const { username, email, role, fullname, gender, birthPlace, birthDate, status } = req.body
        let user = await createUserService(username, role, email, status)
        if (user) {
            const generatedNip = getRandomString(8)
            const userDetail = await createEmployeeService(generatedNip, fullname, gender, birthPlace, birthDate, user.dataValues.id)
            user = Object.assign(user, { detail: userDetail })
            return successResponse(res, user, 201)
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

export const updateUser = async (req: ExtendedRequest, res: Response) => {
    try {
        const { id, email, role, fullname, gender, birthPlace, birthDate, status, employeeId } = req.body
        let user = await updateUserService(id, role, email, status)
        if (user) {
            const userDetail = await updateEmployeeService(employeeId, { fullname, gender, birthPlace, birthDate })
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

export const deleteUser = async (req: ExtendedRequest, res: Response) => {
    try {
        const { id } = req.body
        const user = await deleteUserService(id)
        return successResponse(res, user)
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
            return errorResponse(res, error.message, error, 400)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}