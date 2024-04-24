import express from 'express'
import { validateToken } from '../middlewares/authenticateUser'
import { getAcademicYear } from '../controllers/academicYearController'

const academicYearRoute = express.Router()

academicYearRoute.get('/academic-year', validateToken, getAcademicYear)

export default academicYearRoute