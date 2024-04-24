import { Request, Response } from "express"
import { createConfigService, deleteConfigService, getConfigByIdService, getConfigService, updateConfigService } from "../services/configService"
import sequelize from "sequelize"
import { errorResponse, successResponse } from "../utils/response"
import ExtendedRequest from "../types/extendedRequest"

export const getConfig = async (req: ExtendedRequest, res: Response) => {
    const {page, perPage, id, search} = req.query
    try {
        if (id) {
            const config = await getConfigByIdService(id)
            return successResponse(res, config)
        } else {
            let offset: number = parseInt(page) || 1
            let limit: number = parseInt(perPage) || 10
            let filterSearch: string = search || ''
            const configs = await getConfigService(limit, offset, filterSearch)
            return successResponse(res, configs)
        }
    } catch (error: any) {
        if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const createConfig = async (req: ExtendedRequest, res: Response) => {
    const {key, value, description} = req.body
    try {
        const config = await createConfigService(key, value, description)
        return successResponse(res, config, 201)
    } catch (error: any) {
        if (error instanceof sequelize.ValidationError) {
            return errorResponse(res, error.message, error.errors, 400)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const updateConfig = async (req: ExtendedRequest, res: Response) => {
    const {id, key, value, description} = req.body
    try {
        const config = await updateConfigService(id, {key, value, description})
        return successResponse(res, config)
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

export const deleteConfig = async (req: ExtendedRequest, res: Response) => {
    const {id} = req.body
    try {
        const config = await deleteConfigService(id)
        return successResponse(res, config)
    } catch (error: any) {
        if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}