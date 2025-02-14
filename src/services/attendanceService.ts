import { Op, Sequelize } from "sequelize"
import Attendance from "../models/attendanceModel"
import { getAcademicYearByIdService, getRecentAcademicYearService } from "./academicYearService"
import { getStudentService } from "./studentService"
import { getAllDayOffByRangeService } from "./holidayService"
import Student from "../models/studentModel"
import { getStartEndDate } from "../utils/utility"
import Grade from "../models/gradeModel"
import AcademicYear from "../models/academicYearModel"
import { getConfigByKeyService } from "./configService"

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

export const getDailyAttendanceByGradeService = async (date: string, grade: string) => {
    const academicYear = await getRecentAcademicYearService()
    const startDate = getStartEndDate(date)
    const endDate = getStartEndDate(date, true)
    const attendance = await Student.findAll({
        include: [
            {
                model: Grade,
                where: {
                    id: grade
                }
            },
            {
                model: AcademicYear,
                where: {
                    id: academicYear?.dataValues.id
                }
            },
            {
                model: Attendance,
                where: {
                    date: {
                        [Op.between]: [startDate, endDate]
                    },
                    gradeId: grade,
                    academicYearId: academicYear?.dataValues.id
                },
                required: false
            }
        ]
    })
    // const attendance = await Attendance.findAll({
    //     where: {
    //         date: date,
    //         gradeId: grade,
    //         academicYearId: academicYear?.dataValues.id
    //     },
    //     include: [Student]
    // })
    return attendance
}

export const getMonthlyAttendanceByGradeService = async (academicYear: string, month: number, grade: string) => {
    const academic = await getAcademicYearByIdService(academicYear)
    const config = await getConfigByKeyService('first-academic-month')
    const firstAcadMonth = config.dataValues.value
    const academicStartYear = new Date(academic.dataValues.startDate).getFullYear()
    const academicEndYear = new Date(academic.dataValues.endDate).getFullYear()

    // Get Date Range
    let year = null
    let startDate = null
    let endDate = null
    if (month - 1 > parseInt(firstAcadMonth)) {
        startDate = new Date(academicStartYear, month - 1, 1)
        startDate.setHours(0, 0, 0, 0).toLocaleString()
        endDate = new Date(academicStartYear, month, 0)
        endDate.setHours(23, 59, 59, 999)
        year = academicStartYear
    } else if (month - 1 <= parseInt(firstAcadMonth)) {
        startDate = new Date(academicEndYear, month - 1, 1)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(academicEndYear, month, 0)
        endDate.setHours(23, 59, 59, 999)
        year = academicEndYear
    }

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
                [Op.between]: [startDate!, endDate!]
            },
            gradeId: grade,
            academicYearId: academicYear
        },
        group: ['studentId']
    })

    const studentsPaging = await getStudentService(9999, 1, '', {dir: 'ASC', sort: 'fullname'}, grade, academicYear)
    const students = studentsPaging.rows

    // Get All Day Off
    const dayOffCount = await getAllDayOffByRangeService(startDate!, endDate!)

    for (const [index, item] of students.entries()) {
        const att = attendance.find((att) => att.studentId == item.id)
        if (att) {
            students[index].dataValues = Object.assign(students[index].dataValues, { attendances: att })
        }
    }
    const summary = {
        rows: students,
        dayOff: dayOffCount,
        month: month,
        year: year
    }
    return summary
}

export const getSemesterAttendanceByGradeService = async (academicYear: string, semester: number, grade: string) => {
    const academic = await getAcademicYearByIdService(academicYear)
    const year = new Date(academic.dataValues.startDate).getFullYear()
    const config = await getConfigByKeyService('first-academic-month')
    let firstAcadMonth = 0
    let lastAcadMonth = 0
    if (semester == 1) {
        firstAcadMonth = parseInt(config.dataValues.value)
        lastAcadMonth = firstAcadMonth + 5
    } else if (semester == 2) {
        firstAcadMonth = parseInt(config.dataValues.value) + 6
        lastAcadMonth = firstAcadMonth + 5
    }

    // Get Date Range
    const startDate = new Date(year, firstAcadMonth, 1)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(year, lastAcadMonth + 1, 0)
    endDate.setHours(23, 59, 59, 999)

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
                [Op.between]: [startDate, endDate]
            },
            gradeId: grade,
            academicYearId: academicYear
        },
        group: ['studentId']
    })

    const studentsPaging = await getStudentService(9999, 1, '', {dir: 'ASC', sort: 'fullname'}, grade, academicYear)
    const students = studentsPaging.rows

    // Get All Day Off
    const dayOffCount = await getAllDayOffByRangeService(startDate, endDate)

    for (const [index, item] of students.entries()) {
        const att = attendance.find((att) => att.studentId == item.id)
        if (att) {
            students[index].dataValues = Object.assign(students[index].dataValues, { attendances: att })
        }
    }

    return {
        rows: students,
        dayOff: dayOffCount,
        startDate: new Date(year, firstAcadMonth, 1),
        endDate: endDate
    }
}

export const getYearlyAttendanceByGradeService = async (academicYear: string, grade: string) => {
    const config = await getConfigByKeyService('first-academic-month')
    const firstAcadMonth = config.dataValues.value

    const attendance = await Attendance.findAll({
        attributes: [
            'studentId',
            [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN status = 'H' THEN 1 ELSE 0 END`)), 'hadir'],
            [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN status = 'S' THEN 1 ELSE 0 END`)), 'sakit'],
            [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN status = 'I' THEN 1 ELSE 0 END`)), 'izin'],
            [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN status = 'A' THEN 1 ELSE 0 END`)), 'alpa']
        ],
        where: {
            gradeId: grade,
            academicYearId: academicYear
        },
        group: ['studentId']
    })

    const studentsPaging = await getStudentService(9999, 1, '', {dir: 'ASC', sort: 'fullname'}, grade, academicYear)
    const students = studentsPaging.rows

    for (const [index, item] of students.entries()) {
        const att = attendance.find((att) => att.studentId == item.id)
        if (att) {
            students[index].dataValues = Object.assign(students[index].dataValues, { attendances: att })
        }
    }

    const summary = {
        rows: students,
        // dayOff: dayOffCount,
        // year: year
    }

    return summary
}