import express from 'express'
import { validateToken } from '../middlewares/authenticateUser'
import { createHoliday, deleteHoliday, getHoliday, syncHoliday, updateHoliday } from '../controllers/holidayController'

const holidayRoute = express.Router()

holidayRoute.get('/holidays', validateToken, getHoliday)
holidayRoute.post('/holidays', validateToken, createHoliday)
holidayRoute.put('/holidays', validateToken, updateHoliday)
holidayRoute.delete('/holidays', validateToken, deleteHoliday)
holidayRoute.get('/holidays/sync', validateToken, syncHoliday)

export default holidayRoute