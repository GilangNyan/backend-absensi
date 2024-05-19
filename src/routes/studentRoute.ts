import express from 'express'
import { validateToken } from '../middlewares/authenticateUser'
import { createStudent, deleteStudent, getStudents, updateStudent, createBatchStudents } from '../controllers/studentController'

const studentRoute = express.Router()

studentRoute.get('/students', validateToken, getStudents)
studentRoute.post('/students', validateToken, createStudent)
studentRoute.put('/students', validateToken, updateStudent)
studentRoute.delete('/students', validateToken, deleteStudent)
studentRoute.post('/students/batch', validateToken, createBatchStudents)

export default studentRoute