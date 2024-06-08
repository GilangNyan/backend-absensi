import Attendance from "../models/attendanceModel"

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

export const getMonthlyAttendanceByGradeService = async () => {
    // 
}

export const getYearlyAttendanceByGradeService = async () => {
    // 
}