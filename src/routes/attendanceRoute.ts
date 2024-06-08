import express from 'express'
import { recordAttendance } from '../controllers/attendanceController'

const attendanceRoute = express.Router()

attendanceRoute.post('/record-attendance', recordAttendance)

export default attendanceRoute