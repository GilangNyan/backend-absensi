import express from 'express'
import { downloadDailyAttendanceByGrade, downloadMonthlyAttendanceByGrade, getDailyAttendanceByGrade, getMonthlyAttendanceByGrade, getSemesterAttendanceByGrade, getYearlyAttendanceByGrade, recordAttendance } from '../controllers/attendanceController'
import { validateToken } from '../middlewares/authenticateUser'

const attendanceRoute = express.Router()

attendanceRoute.post('/record-attendance', recordAttendance)
attendanceRoute.get('/attendance/daily', validateToken, getDailyAttendanceByGrade)
attendanceRoute.get('/attendance/monthly', validateToken, getMonthlyAttendanceByGrade)
attendanceRoute.get('/attendance/semester', validateToken, getSemesterAttendanceByGrade)
attendanceRoute.get('/attendance/yearly', validateToken, getYearlyAttendanceByGrade)
attendanceRoute.get('/attendance/daily/download', validateToken, downloadDailyAttendanceByGrade)
attendanceRoute.get('/attendance/monthly/download', validateToken, downloadMonthlyAttendanceByGrade)

export default attendanceRoute