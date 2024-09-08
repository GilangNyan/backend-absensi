import { Op } from "sequelize"
import User from "../models/userModel"
import { hash } from "../utils/crypt"
import { getConfigByKeyService } from "./configService"
import Role from "../models/roleModel"
import { getPagingData } from "../utils/utility"
import Employee from "../models/employeeModel"

export const getUserService = async (limit: number, offset: number, search: string) => {
    const result = await User.findAndCountAll({
        limit: limit,
        offset: (offset - 1) * limit,
        where: {
            [Op.or]: [
                {
                    email: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    username: {
                        [Op.iLike]: `%${search}%`
                    }
                }
            ]
        },
        include: [Role, Employee]
    })
    const response = getPagingData(result, offset, limit)
    return response
}

export const getUserById = async (id: string) => {
    const result = await User.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    return result
}

export const createUserService = async (username: string, roleId: string, email: string | any = null, status: string | null = null) => {
    let defaultPassword = await getConfigByKeyService('user-default-password')
    let password: string = hash(defaultPassword.dataValues.value)
    const result = await User.create({
        email: email,
        username: username,
        password: password,
        roleId: roleId,
        status: status != null ? status : 'A'
    })
    return result
}

export const updateUserService = async (id: string, roleId: string, email: string | any = null, status: string | null = null) => {
    const result = await User.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    result.email = email
    result.roleId = roleId
    result.status = status != null ? status : 'A'
    await result.save()
    return result
}

export const deleteUserService = async (id: string) => {
    const result = await User.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    await result.destroy()
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