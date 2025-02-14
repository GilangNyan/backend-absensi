import { Response } from "express";
import ExtendedRequest from "../types/extendedRequest";
import { getDailyAttendanceByGradeService, getMonthlyAttendanceByGradeService, getSemesterAttendanceByGradeService, getYearlyAttendanceByGradeService, recordAttendanceService } from "../services/attendanceService";
import { errorResponse, successResponse } from "../utils/response";
import sequelize from "sequelize"
import { getRecentAcademicYearService } from "../services/academicYearService";
import { getHolidayByDateService } from "../services/holidayService";
import { downloadPdf, downloadXlsx, IDataStructure } from "../services/downloadFileService";

export const recordAttendance = async (req: ExtendedRequest, res: Response): Promise<unknown> => {
    const { studentId, gradeId, academicYearId, date, status } = req.body
    try {
        let academicYear = academicYearId
        if (academicYear == undefined || academicYear == null || academicYear == '') {
            const academicYearData = await getRecentAcademicYearService()
            academicYear = academicYearData?.dataValues.id
        }

        let checkHoliday = await getHolidayByDateService(date)
        const checkDay = new Date().getDay() // Cek hari, 0 = minggu, 1 = senin, dst.
        if (checkHoliday || checkDay == 0) {
            const message = 'Cannot Record Attendance on Holiday'
            return errorResponse(res, message, 'ForbiddenAttendanceError', 400)
        }

        const attendance = await recordAttendanceService(studentId, gradeId, academicYear, date, status)
        return successResponse(res, attendance, 201)
    } catch (error: any) {
        if (error instanceof sequelize.ValidationError) {
            return errorResponse(res, error.message, error.errors, 400)
        } else {
            return errorResponse(res, error.message, error)
        }
    }
}

export const getDailyAttendanceByGrade = async (req: ExtendedRequest, res: Response): Promise<unknown> => {
    const { date, grade } = req.query
    try {
        const result = await getDailyAttendanceByGradeService(date, grade)
        return successResponse(res, result)
    } catch (error: any) {
        return errorResponse(res, error.message, error)
    }
}

export const getMonthlyAttendanceByGrade = async (req: ExtendedRequest, res: Response): Promise<unknown> => {
    const { year, month, grade } = req.query
    try {
        // const result = await getMonthlyAttendanceByGradeService(parseInt(year), parseInt(month), grade)
        const result = await getMonthlyAttendanceByGradeService(year, parseInt(month), grade)
        return successResponse(res, result)
    } catch (error: any) {
        return errorResponse(res, error.message, error)
    }
}

export const getSemesterAttendanceByGrade = async (req: ExtendedRequest, res: Response): Promise<unknown> => {
    const { year, semester, grade } = req.query
    try {
        const result = await getSemesterAttendanceByGradeService(year, parseInt(semester), grade)
        return successResponse(res, result)
    } catch (error: any) {
        return errorResponse(res, error.message, error)
    }
}

export const getYearlyAttendanceByGrade = async (req: ExtendedRequest, res: Response): Promise<unknown> => {
    const { year, grade } = req.query
    try {
        const result = await getYearlyAttendanceByGradeService(year, grade)
        return successResponse(res, result)
    } catch (error: any) {
        return errorResponse(res, error.message, error)
    }
}

export const downloadDailyAttendanceByGrade = async (req: ExtendedRequest, res: Response): Promise<unknown> => {
    const { date, grade, type } = req.query
    try {
        const result = await getDailyAttendanceByGradeService(date, grade)
        if (type == 'xlsx') {
            return downloadXlsx(res, result, 'daily-attendance', 'Daily Attendance Reports')
        } else if (type == 'pdf') {
            return downloadPdf(res, result, 'daily-attendance', grade, date)
        }
    } catch (error: any) {
        return errorResponse(res, error.message, error)
    }
}

export const downloadMonthlyAttendanceByGrade = async (req: ExtendedRequest, res: Response): Promise<unknown> => {
    const { year, month, grade } = req.query
    try {
        const result = await getMonthlyAttendanceByGradeService(year, parseInt(month), grade)
        return downloadXlsx(res, (result as IDataStructure), 'monthly-attendance', 'Monthly Attendance Reports')
    } catch (error: any) {
        return errorResponse(res, error.message, error)
    }
}