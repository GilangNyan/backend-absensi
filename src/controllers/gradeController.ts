import { Response } from "express";
import ExtendedRequest from "../types/extendedRequest";
import sequelize from "sequelize"
import { errorResponse, successResponse } from "../utils/response";
import { createGradeService, deleteGradeService, getGradeByIdService, getGradeService, updateGradeService } from "../services/gradeService";

export const getGrade = async (req: ExtendedRequest, res: Response) => {
    const {page, perPage, id, search} = req.query
    try {
        if (id) {
            const result = await getGradeByIdService(id)
            return successResponse(res, result)
        } else {
            let offset: number = parseInt(page) || 1
            let limit: number = parseInt(perPage) || 10
            let filterSearch: string = search || ''
            const result = await getGradeService(limit, offset, filterSearch)
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

export const createGrade = async (req: ExtendedRequest, res: Response) => {
    const { name } = req.body
    try {
        const grade = await createGradeService(name)
        return successResponse(res, grade, 201)
    } catch (error: any) {
        if (error instanceof sequelize.ValidationError) {
            return errorResponse(res, error.message, error.errors, 400)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const updateGrade = async (req: ExtendedRequest, res: Response) => {
    const { id, name } = req.body
    try {
        const grade = await updateGradeService(id, { name })
        return successResponse(res, grade)
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

export const deleteGrade = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.body
    try {
        const config = await deleteGradeService(id)
        return successResponse(res, config)
    } catch (error: any) {
        if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}