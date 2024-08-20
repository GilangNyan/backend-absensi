import express from 'express'
import { createSuperadminUser, updatePasswordUser } from '../controllers/userController'
import { validateToken } from '../middlewares/authenticateUser'

const userRoute = express.Router()

userRoute.post('/create-superadmin', createSuperadminUser)
userRoute.post('/change-password', validateToken, updatePasswordUser)

export default userRoute