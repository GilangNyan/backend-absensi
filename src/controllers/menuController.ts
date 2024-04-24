import { Response } from "express";
import ExtendedRequest from "../types/extendedRequest";
import { errorResponse, successResponse } from "../utils/response";
import { createMenuService, deleteMenuService, getMenuByIdService, getMenuService, updateMenuService } from "../services/menuService";
import * as sequelize from "sequelize";

export const getMenu = async (req: ExtendedRequest, res: Response) => {
    const {page, perPage, id, search} = req.query
    try {
        if (id) {
            const role = await getMenuByIdService(id)
            return successResponse(res, role)
        } else {
            let offset: number = parseInt(page) || 1
            let limit: number = parseInt(perPage) || 10
            let filterSearch: string = search || ''
            const roles = await getMenuService(limit, offset, filterSearch)
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

export const createMenus = async (req: ExtendedRequest, res: Response) => {
    const {name, icon, level, hasChild, url, isActive} = req.body
    try {
        const result = await createMenuService(name, icon, level, hasChild, url, isActive)
        return successResponse(res, result, 201)
    } catch (error: any) {
        if (error instanceof sequelize.ValidationError) {
            return errorResponse(res, error.message, error.errors, 400)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const updateMenus = async (req: ExtendedRequest, res: Response) => {
    const {id, name, icon, level, hasChild, url, isActive} = req.body
    try {
        const result = await updateMenuService(id, {name, icon, level, hasChild, url, isActive})
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

export const deleteMenus = async (req: ExtendedRequest, res: Response) => {
    const {id} = req.body
    try {
        const result = await deleteMenuService(id)
        return successResponse(res, result)
    } catch (error: any) {
        if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}