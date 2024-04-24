import express from 'express'
import { createSuperadminUser } from '../controllers/userController'

const userRoute = express.Router()

userRoute.post('/create-superadmin', createSuperadminUser)

export default userRoute