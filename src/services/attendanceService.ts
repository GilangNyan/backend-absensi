import { Op, Sequelize } from "sequelize"
import Attendance from "../models/attendanceModel"
import { getRecentAcademicYearService } from "./academicYearService"
import { getStudentService } from "./studentService"
import { getAllDayOffByRangeService } from "./holidayService"

export const recordAttendanceService = async (studentId: string, gradeId: string, academicYearId: string, date: string, status: string) => {
    const attendance = await Attendance.create({
        studentId: studentId,
        gradeId: gradeId,
        academicYearId: academicYearId,
        date: date,
        status: status,
    })
    return attendance
}

export const getDailyAttendanceByGradeService = async () => {
    // 
}

export const getMonthlyAttendanceByGradeService = async (year: number, month: number, grade: string) => {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    const totalDayOff = await getAllDayOffByRangeService(startDate, endDate)
    const academicYear = await getRecentAcademicYearService()
    const studentsPaging = await getStudentService(9999, 1, '', {dir: 'ASC', sort: 'fullname'}, grade, academicYear!.dataValues.id)
    const attendance = await Attendance.findAll({
        attributes: [
            'studentId',
            [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN status = 'H' THEN 1 ELSE 0 END`)), 'hadir'],
            [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN status = 'S' THEN 1 ELSE 0 END`)), 'sakit'],
            [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN status = 'I' THEN 1 ELSE 0 END`)), 'izin'],
            [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN status = 'A' THEN 1 ELSE 0 END`)), 'alpa']
        ],
        where: {
            date: {
                [Op.between]: [startDate, endDate],
            },
            gradeId: grade,
            academicYearId: academicYear?.dataValues.id
        },
        group: ['studentId'],
        raw: true
    })
    let students = studentsPaging.rows
    for (const [index, item] of students.entries()) {
        const att = attendance.find((att) => att.studentId == item.id)
        if (att) {
            students[index].dataValues = Object.assign(students[index].dataValues, { attendances: att })
        }
    }
    const summary = {
        rows: students,
        dayOff: totalDayOff
    }
    return summary
}

export const getYearlyAttendanceByGradeService = async (year: string) => {
    // 
}