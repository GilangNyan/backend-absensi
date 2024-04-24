import User from "../models/userModel"
import { hash } from "../utils/crypt"
import { getConfigByKeyService } from "./configService"

export const createUserService = async (username: string, roleId: string, email: string | any = null) => {
    let defaultPassword = await getConfigByKeyService('user-default-password')
    let password: string = hash(defaultPassword.dataValues.value)
    const result = await User.create({
        email: email,
        username: username,
        password: password,
        roleId: roleId
    })
    return result
}

export const updateUserService = async (id: string, roleId: string, email: string | any = null) => {
    const result = await User.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    result.email = email
    result.roleId = roleId
    await result.save()
    return result
}

export const updatePasswordService = async (id: string, password: string) => {
    const result = await User.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    result.password = hash(password)
    result.changePassword = false
    await result.save()
    return result
}