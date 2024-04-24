import express from 'express'
import { validateToken } from '../middlewares/authenticateUser'
import { createMenus, deleteMenus, getMenu, updateMenus } from '../controllers/menuController'

const menuRoute = express.Router()

menuRoute.get('/menus', validateToken, getMenu)
menuRoute.post('/menus', validateToken, createMenus)
menuRoute.put('/menus', validateToken, updateMenus)
menuRoute.delete('/menus', validateToken, deleteMenus)

export default menuRoute