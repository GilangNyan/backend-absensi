import { Op } from "sequelize"
import Role from "../models/roleModel"
import { getPagingData } from "../utils/utility"

export const getRolesService = async (limit: number, offset: number, search: string) => {
    let roles = await Role.findAndCountAll({
        limit: limit,
        offset: (offset - 1) * limit,
        where: {
            [Op.or]: [
                {
                    name: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    description: {
                        [Op.iLike]: `%${search}%`
                    }
                }
            ]
        }
    })
    let response: any = getPagingData(roles, offset, limit)
    return response
}

export const getRoleByIdService = async (id: string) => {
    const role = await Role.findByPk(id)
    if (!role) {
        throw new Error('Not found')
    }
    return role
}

export const getRoleByNameService = async (name: string) => {
    const role = await Role.findOne({
        where: {
            name: name
        }
    })
    if (!role) {
        throw new Error('Not found')
    }
    return role
}

export const createRoleService = async (name: string, description: string) => {
    const role = await Role.create({
        name: name,
        description: description
    })
    return role
}

export const updateRoleService = async (id: string, updatedData: { name: string, description: string }) => {
    const role = await Role.findByPk(id)
    if (!role) {
        throw new Error('Not found')
    }
    await role.update(updatedData)
    return role
}

export const deleteRoleService = async (id: string) => {
    const role = await Role.findByPk(id)
    if (!role) {
        throw new Error('Not found')
    }
    await role.destroy()
    return role
}