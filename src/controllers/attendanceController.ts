import { Response } from "express";
import ExtendedRequest from "../types/extendedRequest";
import { recordAttendanceService } from "../services/attendanceService";
import { errorResponse, successResponse } from "../utils/response";
import sequelize from "sequelize"
import { getRecentAcademicYearService } from "../services/academicYearService";
import { getHolidayByDateService } from "../services/holidayService";

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