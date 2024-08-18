import express from 'express'
import { getMonthlyAttendanceByGrade, recordAttendance } from '../controllers/attendanceController'
import { validateToken } from '../middlewares/authenticateUser'

const attendanceRoute = express.Router()

attendanceRoute.post('/record-attendance', recordAttendance)
attendanceRoute.get('/attendance/monthly', validateToken, getMonthlyAttendanceByGrade)

export default attendanceRoute