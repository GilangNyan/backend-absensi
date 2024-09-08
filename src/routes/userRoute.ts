import express from 'express'
import { createSuperadminUser, createUser, deleteUser, getUsers, updatePasswordUser, updateUser } from '../controllers/userController'
import { validateToken } from '../middlewares/authenticateUser'

const userRoute = express.Router()

userRoute.get('/users', validateToken, getUsers)
userRoute.post('/users', validateToken, createUser)
userRoute.put('/users', validateToken, updateUser)
userRoute.delete('/users', validateToken, deleteUser)
userRoute.post('/create-superadmin', createSuperadminUser)
userRoute.post('/change-password', validateToken, updatePasswordUser)

export default userRoute