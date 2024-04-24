import e, { Response } from "express";
import { createEmployeeService, getEmployeeByIdService, getEmployeeService } from "../services/employeeService";
import { errorResponse, successResponse } from "../utils/response";
import * as sequelize from "sequelize";
import ExtendedRequest from "../types/extendedRequest";
import { createUserService } from "../services/userService";

export const getEmployee = async (req: ExtendedRequest, res: Response) => {
    const {page, perPage, id, search} = req.query
    try {
        if (id) {
            const role = await getEmployeeByIdService(id)
            return successResponse(res, role)
        } else {
            let offset: number = parseInt(page) || 1
            let limit: number = parseInt(perPage) || 10
            let filterSearch: string = search || ''
            const roles = await getEmployeeService(limit, offset, filterSearch)
            return successResponse(res, roles)
        }
    } catch (error: any) {
        if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const createEmployee = async (req: ExtendedRequest, res: Response) => {
    const {nip, fullname, gender, birthPlace, birthDate, username, email, role} = req.body
    try {
        let user = await createUserService(username, role, email)
        if (user) {
            const employee = await createEmployeeService(nip, fullname, gender, birthPlace, birthDate, user.dataValues.id)
            user = Object.assign(user, { detail: employee })
            return successResponse(res, user)
        }
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