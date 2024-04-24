import express from 'express'
import { createRoles, deleteRoles, getRoles, updateRoles } from '../controllers/roleController'
import { validateToken } from '../middlewares/authenticateUser'

const roleRoute = express.Router()

roleRoute.get('/roles', validateToken, getRoles)
roleRoute.post('/roles', validateToken, createRoles)
roleRoute.put('/roles', validateToken, updateRoles)
roleRoute.delete('/roles', validateToken, deleteRoles)

export default roleRoute