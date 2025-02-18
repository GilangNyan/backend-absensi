import express from 'express'
import { validateToken } from '../middlewares/authenticateUser'
import { getDashboardSummary } from '../controllers/dashboardController'

const dashboardRoute = express.Router()

dashboardRoute.get('/dashboard/summary', validateToken, getDashboardSummary)

export default dashboardRoute