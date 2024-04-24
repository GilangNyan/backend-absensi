import * as sequelize from "sequelize";
import ExtendedRequest from "../types/extendedRequest";
import { createSubmenuService, deleteSubmenuService, getSubmenuByIdService, getSubmenuService, updateSubmenuService } from "../services/submenuService";
import { errorResponse, successResponse } from "../utils/response";
import { Response } from "express";

export const getSubmenus = async (req: ExtendedRequest, res: Response) => {
    const {page, perPage, id, search} = req.query
    try {
        if (id) {
            const role = await getSubmenuByIdService(id)
            return successResponse(res, role)
        } else {
            let offset: number = parseInt(page) || 1
            let limit: number = parseInt(perPage) || 10
            let filterSearch: string = search || ''
            const roles = await getSubmenuService(limit, offset, filterSearch)
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

export const createSubmenus = async (req: ExtendedRequest, res: Response) => {
    const {name, level, url, isActive, menuId} = req.body
    try {
        const result = await createSubmenuService(name, level, url, isActive, menuId)
        return successResponse(res, result, 201)
    } catch (error: any) {
        if (error instanceof sequelize.ValidationError) {
            return errorResponse(res, error.message, error.errors, 400)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const updateSubmenus = async (req: ExtendedRequest, res: Response) => {
    const {id, name, level, url, isActive, menuId} = req.body
    try {
        const result = await updateSubmenuService(id, {name, level, url, isActive, menuId})
        return successResponse(res, result)
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

export const deleteSubmenus = async (req: ExtendedRequest, res: Response) => {
    const {id} = req.body
    try {
        const result = await deleteSubmenuService(id)
        return successResponse(res, result)
    } catch (error: any) {
        if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}