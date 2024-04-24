import ExtendedRequest from "../types/extendedRequest"
import { getAcademicYearByIdService, getAcademicYearService } from "../services/academicYearService"
import { errorResponse, successResponse } from "../utils/response"
import { Response } from "express"

export const getAcademicYear = async (req: ExtendedRequest, res: Response) => {
    const {page, perPage, id, search} = req.query
    try {
        if (id) {
            const academicYear = await getAcademicYearByIdService(id)
            return successResponse(res, academicYear)
        } else {
            let offset: number = parseInt(page) || 1
            let limit: number = parseInt(perPage) || 10
            let filterSearch: string = search || ''
            const academicYears = await getAcademicYearService(limit, offset, filterSearch)
            return successResponse(res, academicYears)
        }
    } catch (error: any) {
        if (error.message == 'Not found') {
            return errorResponse(res, error.message, error, 404)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}