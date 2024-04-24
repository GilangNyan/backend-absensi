import * as express from "express"
import { checkUserPassword, validateToken } from "../middlewares/authenticateUser"
import { login, logout, register } from "../controllers/authController"

const authRoute = express.Router()

authRoute.post('/login', checkUserPassword, login)
authRoute.post('/register', register)
authRoute.post('/logout', validateToken, logout)

export default authRoute