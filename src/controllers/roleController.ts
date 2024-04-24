import { Request, Response } from "express";
import { createRoleService, deleteRoleService, getRoleByIdService, getRolesService, updateRoleService } from "../services/roleService";
import * as sequelize from "sequelize";
import { errorResponse, successResponse } from "../utils/response";
import ExtendedRequest from "../types/extendedRequest";
import { assignMenus } from "../services/menuService";

export const getRoles = async (req: ExtendedRequest, res: Response) => {
    const {page, perPage, id, search} = req.query
    try {
        if (id) {
            const role = await getRoleByIdService(id)
            return successResponse(res, role)
        } else {
            let offset: number = parseInt(page) || 1
            let limit: number = parseInt(perPage) || 10
            let filterSearch: string = search || ''
            const roles = await getRolesService(limit, offset, filterSearch)
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

export const createRoles = async (req: ExtendedRequest, res: Response) => {
    const {name, description, menus} = req.body
    try {
        const role = await createRoleService(name, description)
        await assignMenus(role.dataValues.id, menus)
        return successResponse(res, role, 201)
    } catch (error: any) {
        if (error instanceof sequelize.ValidationError) {
            return errorResponse(res, error.message, error.errors, 400)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const updateRoles = async (req: ExtendedRequest, res: Response) => {
    const {id, name, description, menus} = req.body
    try {
        const role = await updateRoleService(id, { name, description })
        await assignMenus(id, menus)
        return successResponse(res, role)
    } catch (error: any) {
        if (error instanceof sequelize.ValidationError) {
            return errorResponse(res, error.message, error.errors, 400)
        } else if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const deleteRoles = async (req: ExtendedRequest, res: Response) => {
    const {id} = req.body
    try {
        const role = await deleteRoleService(id)
        return successResponse(res, role)
    } catch (error: any) {
        if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}