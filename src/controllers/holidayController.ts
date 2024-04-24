import sequelize from "sequelize"
import ExtendedRequest from "../types/extendedRequest"
import { createHolidayService, deleteHolidayService, getHolidayByIdService, getHolidayService, syncHolidayService, updateHolidayService } from "../services/holidayService"
import { errorResponse, successResponse } from "../utils/response"
import { Response } from "express"

export const getHoliday = async (req: ExtendedRequest, res: Response) => {
    const {page, perPage, id, search} = req.query
    try {
        if (id) {
            const result = await getHolidayByIdService(id)
            return successResponse(res, result)
        } else {
            let offset: number = parseInt(page) || 1
            let limit: number = parseInt(perPage) || 10
            let filterSearch: string = search || ''
            const result = await getHolidayService(limit, offset, filterSearch)
            return successResponse(res, result)
        }
    } catch (error: any) {
        if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const createHoliday = async (req: ExtendedRequest, res: Response) => {
    const {name, date, description} = req.body
    try {
        const result = await createHolidayService(name, date, description)
        return successResponse(res, result, 201)
    } catch (error: any) {
        if (error instanceof sequelize.ValidationError) {
            return errorResponse(res, error.message, error.errors, 400)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const updateHoliday = async (req: ExtendedRequest, res: Response) => {
    const {id, name, date, description} = req.body
    try {
        const result = await updateHolidayService(id, {name, date, description})
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

export const deleteHoliday = async (req: ExtendedRequest, res: Response) => {
    const {id} = req.body
    try {
        const result = await deleteHolidayService(id)
        return successResponse(res, result)
    } catch (error: any) {
        if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const syncHoliday = async (req: ExtendedRequest, res: Response) => {
    try {
        const result = await syncHolidayService()
        console.log(result)
        return res.status(200).send(result)
    } catch (error: any) {
        return errorResponse(res, error.message, error)
    }
}