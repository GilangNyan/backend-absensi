import User from "../models/userModel"
import { hash } from "../utils/crypt"

export const loginUserService = async (username: string, password: string) => {
    // 
}

export const registerUserService = async (email: string, username: string, password: string, roleId: string) => {
    let hashedPassword = hash(password)
    let result = User.create({
        username: username,
        email: email,
        password: hashedPassword,
        roleId: roleId
    })
    return result
}

export const logoutUserService = async (username: string, password: string) => {
    // 
}