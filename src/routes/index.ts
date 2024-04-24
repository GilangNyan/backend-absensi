import * as express from 'express'
import roleRoute from './roleRoute'
import configRoute from './configRoute'
import authRoute from './authRoute'
import employeeRoute from './employeeRoute'
import userRoute from './userRoute'
import menuRoute from './menuRoute'
import submenuRoute from './submenuRoute'
import holidayRoute from './holidayRoute'
import studentRoute from './studentRoute'
import gradeRoute from './gradeRoute'
import academicYearRoute from './academicYearRoute'

export const routes = express.Router()

routes.use(roleRoute)
routes.use(configRoute)
routes.use(authRoute)
routes.use(employeeRoute)
routes.use(userRoute)
routes.use(menuRoute)
routes.use(submenuRoute)
routes.use(holidayRoute)
routes.use(studentRoute)
routes.use(gradeRoute)
routes.use(academicYearRoute)