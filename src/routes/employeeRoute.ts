import express from 'express'
import { createEmployee, getEmployee } from '../controllers/employeeController'
import { validateToken } from '../middlewares/authenticateUser'

const employeeRoute = express.Router()

employeeRoute.get('/employee', validateToken, getEmployee)
employeeRoute.post('/employee', validateToken, createEmployee)

export default employeeRoute