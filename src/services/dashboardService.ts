import { Op } from "sequelize"
import AcademicYear from "../models/academicYearModel"
import Attendance from "../models/attendanceModel"
import Student from "../models/studentModel"
import { getConfigByKeyService } from "./configService"

export const getDashboardSummaryService = async (academicYear: string) => {
  const activeStudent = await getActiveStudent(academicYear)
  const todayAttended = await getTodayAttendedStudent(academicYear)
  const todayLate = await getTodayLateStudent(academicYear)

  const summary = {
    activeStudents: activeStudent,
    studentsAttended: todayAttended,
    studentsLate: todayLate,
    studentsNotAttended: activeStudent - todayAttended
  }
  return summary
}

const getActiveStudent = async (academicYear: string) => {
  const result = await Student.count({
    include: [
      {
        model: AcademicYear,
        where: {
          id: academicYear
        }
      }
    ]
  })

  return result
}

const getTodayAttendedStudent = async (academicYear: string) => {
  const startRange = new Date().setHours(0, 0, 0, 0)
  const endRange = new Date().setHours(23, 59, 59, 999)
  const result = await Attendance.count({
    where: {
      date: {
        [Op.between]: [startRange, endRange]
      },
      academicYearId: academicYear,
      status: 'H'
    }
  })

  return result
}

const getTodayLateStudent = async (academicYear: string) => {
  const onTimeEntry = await getConfigByKeyService('on-time-entry')
  const onTimeEntryHour = parseInt(onTimeEntry.value.split(':')[0] ?? '07')
  const onTimeEntryMinute = parseInt(onTimeEntry.value.split(':')[1] ?? '30')
  const startRange = new Date().setHours(onTimeEntryHour, onTimeEntryMinute, 0, 0)
  const endRange = new Date().setHours(23, 59, 59, 999)
  const result = await Attendance.count({
    where: {
      date: {
        [Op.between]: [startRange, endRange]
      },
      academicYearId: academicYear,
      status: 'H'
    }
  })

  return result
}