import { Response } from "express";

interface apiResponse {
    success: boolean
    data?: any
    error?: {
        message: string,
        errors?: any
    }
}

export const successResponse = (res: Response, data: any, statusCode: number = 200) => {
    const response: apiResponse = {
        success: true,
        data: data
    }
    return res.status(statusCode).json(response)
}

export const errorResponse = (res: Response, message: string, errors: any, statusCode: number = 500) => {
    const response: apiResponse = {
        success: false,
        error: {
            message: message,
            errors: errors
        }
    }
    return res.status(statusCode).json(response)
}