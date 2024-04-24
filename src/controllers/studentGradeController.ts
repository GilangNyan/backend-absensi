import { Response } from "express";
import ExtendedRequest from "../types/extendedRequest";
import { registerStudentsGradeService } from "../services/studentGradeService";
import { errorResponse, successResponse } from "../utils/response";
import sequelize from "sequelize"

export const registerStudentsGrade = async (req: ExtendedRequest, res: Response) => {
    const {data} = req.body
    try {
        console.log(data)
        const result = await registerStudentsGradeService(data)
        return successResponse(res, result)
    } catch (error: any) {
        if (error instanceof sequelize.ValidationError) {
            return errorResponse(res, error.message, error.errors, 400)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}