import express from 'express'
import { createConfig, deleteConfig, getConfig, updateConfig } from '../controllers/configController'
import { validateToken } from '../middlewares/authenticateUser'

const configRoute = express.Router()

configRoute.get('/config', validateToken, getConfig)
configRoute.post('/config', validateToken, createConfig)
configRoute.put('/config', validateToken, updateConfig)
configRoute.delete('/config', validateToken, deleteConfig)

export default configRoute