import { Op } from "sequelize"
import Submenu from "../models/submenuModel"
import { getPagingData } from "../utils/utility"
import Menu from "../models/menuModel"

export const getSubmenuService = async (limit: number, offset: number, search: string) => {
    let result = await Submenu.findAndCountAll({
        limit: limit,
        offset: (offset - 1) * limit,
        where: {
            [Op.or] : [
                {
                    name: {
                        [Op.iLike]: `%${search}%`
                    }
                }
            ]
        },
        include: [Menu]
    })
    let response: any = getPagingData(result, offset, limit)
    return response
}

export const getSubmenuByIdService = async (id: string) => {
    const result = await Submenu.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    return result
}

export const createSubmenuService = async (name: string, level: number, url: string, isActive: boolean, menuId: number) => {
    const result = await Submenu.create({
        name: name,
        level: level,
        url: url,
        isActive: isActive,
        menuId: menuId
    })
    return result
}

export const updateSubmenuService = async (id: string, updatedData: { name: string, level: number, url: string, isActive: boolean, menuId: number }) => {
    const result = await Submenu.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    await result.update(updatedData)
    return result
}

export const deleteSubmenuService = async (id: string) => {
    const result = await Submenu.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    await result.destroy()
    return result
}