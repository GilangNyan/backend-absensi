import { Response } from "express";
import ExtendedRequest from "../types/extendedRequest";
import { errorResponse, successResponse } from "../utils/response";
import { createBatchStudentsService, createStudentsService, deleteStudentsService, getStudentByIdService, getStudentService, updateStudentsService } from "../services/studentService";
import sequelize from "sequelize"
import Sorting from "../types/sorting";

export const getStudents = async (req: ExtendedRequest, res: Response) => {
    const {page, perPage, id, search, filter, sort, dir} = req.query
    try {
        if (id) {
            const result = await getStudentByIdService(id)
            return successResponse(res, result)
        } else {
            let offset: number = parseInt(page) || 1
            let limit: number = parseInt(perPage) || 10
            let filterSearch: string = search || ''
            let sorting: Sorting = {
                sort: sort ? sort : 'updatedAt',
                dir: dir ? dir : 'ASC'
            }
            const results = await getStudentService(limit, offset, filterSearch, filter, sorting)
            return successResponse(res, results)
        }
    } catch (error: any) {
        if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const createStudent = async (req: ExtendedRequest, res: Response) => {
    const {nisn, nipd, fullname, gender, birthDate, birthPlace} = req.body
    try {
        const config = await createStudentsService(nisn, nipd, fullname, gender, birthPlace, birthDate)
        return successResponse(res, config, 201)
    } catch (error: any) {
        if (error instanceof sequelize.ValidationError) {
            return errorResponse(res, error.message, error.errors, 400)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const updateStudent = async (req: ExtendedRequest, res: Response) => {
    const {id, nisn, nipd, fullname, gender, birthDate, birthPlace} = req.body
    try {
        const result = await updateStudentsService(id, {nisn, nipd, fullname, gender, birthPlace, birthDate})
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

export const deleteStudent = async (req: ExtendedRequest, res: Response) => {
    const {id} = req.body
    try {
        const result = await deleteStudentsService(id)
        return successResponse(res, result)
    } catch (error: any) {
        if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const createBatchStudents = async (req: ExtendedRequest, res: Response) => {
    const {data} =  req.body
    try {
        console.log(data)
        const result = await createBatchStudentsService(data)
        return successResponse(res, result)
    } catch (error: any) {
        if (error instanceof sequelize.ValidationError) {
            return errorResponse(res, error.message, error.errors, 400)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}