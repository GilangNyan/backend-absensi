import express from 'express'
import { validateToken } from '../middlewares/authenticateUser'
import { createSubmenus, deleteSubmenus, getSubmenus, updateSubmenus } from '../controllers/submenuController'

const submenuRoute = express.Router()

submenuRoute.get('/submenus', validateToken, getSubmenus)
submenuRoute.post('/submenus', validateToken, createSubmenus)
submenuRoute.put('/submenus', validateToken, updateSubmenus)
submenuRoute.delete('/submenus', validateToken, deleteSubmenus)

export default submenuRoute