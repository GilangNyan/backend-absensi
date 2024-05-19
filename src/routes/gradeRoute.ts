import express from 'express'
import { validateToken } from '../middlewares/authenticateUser'
import { createGrade, deleteGrade, getGrade, updateGrade } from '../controllers/gradeController'
import { registerStudentsGrade } from '../controllers/studentGradeController'

const gradeRoute = express.Router()
gradeRoute.get('/grade', validateToken, getGrade)
gradeRoute.post('/grade', validateToken, createGrade)
gradeRoute.put('/grade', validateToken, updateGrade)
gradeRoute.delete('/grade', validateToken, deleteGrade)

gradeRoute.post('/grade/register', validateToken, registerStudentsGrade)

export default gradeRoute