import { Op } from "sequelize"
import Menu from "../models/menuModel"
import { getPagingData } from "../utils/utility"
import Submenu from "../models/submenuModel"
import Role from "../models/roleModel"
import RoleAccess from "../models/roleAccessModel"
import { sequelize } from "../config/database"

export const getMenuService = async (limit: number, offset: number, search: string) => {
    let result = await Menu.findAndCountAll({
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
        }
    })
    let response: any = getPagingData(result, offset, limit)
    return response
}

export const getMenuByIdService = async (id: string) => {
    const result = await Menu.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    return result
}

export const createMenuService = async (name: string, icon: string, level: number, hasChild: boolean, url: string, isActive: boolean) => {
    const result = await Menu.create({
        name: name,
        icon: icon,
        level: level,
        hasChild: hasChild,
        url: url,
        isActive: isActive
    })
    return result
}

export const updateMenuService = async (id: string, updatedData: { name: string, icon: string, level: number, hasChild: boolean, url: string, isActive: boolean }) => {
    const result = await Menu.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    await result.update(updatedData)
    return result
}

export const deleteMenuService = async (id: string) => {
    const result = await Menu.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    await result.destroy()
    return result
}

export const getMenusByRole = async (roleId: string) => {
    const result = await Role.findByPk(roleId, {
        include: [
            {
                model: Menu,
                include: [Submenu]
            }
        ]
    })
    if (!result) {
        throw new Error('Not found')
    }
    const menus = result.menus
    if (menus) {
        menus.sort((a: any, b: any) => {
            return (a.level > b.level) ? 1 : ((b.level > a.level) ? -1 : 0)
        })
        menus.forEach((items: any) => {
            if (items.submenus && items.submenus.length != 0) {
                let index = menus.findIndex(index => {
                    return index.id == items.id
                })
                menus[index].submenus!.sort((a: any, b: any) => {
                    return (a.level > b.level) ? 1 : ((b.level > a.level) ? -1 : 0)
                })
            }
        })
    }
    return menus
}

const getAssignedMenus = async (roleId: string) => {
    const result = await RoleAccess.findAll({
        where: {
            roleId: roleId
        }
    })
    return result
}

export const assignMenus = async (roleId: string, menus: any) => {
    // Ambil Menu yang sudah assigned berdasakan Roles
    let assignedMenus = await getAssignedMenus(roleId)
    // Buat wadah untuk menu baru yang belum ter-assign
    let newAssignedMenus: any = []
    let notAssignedMenus: any = assignedMenus.filter((item: any) => {
        return !menus.includes(item.menuId)
    })
    // Cek duplikasi request menu dengan assigned menu yang sudah ada di database
    await menus.forEach((association: any) => {
        if (assignedMenus.length !== 0) {
            const isDuplicate = assignedMenus.some((existingAssoc: any) => {
                return existingAssoc.roleId == roleId && existingAssoc.menuId == association
            })
            if (!isDuplicate) {
                newAssignedMenus.push({
                    roleId: roleId,
                    menuId: association
                })
            }
        } else {
            newAssignedMenus.push({
                roleId: roleId,
                menuId: association
            })
        }
    });
    const result = await sequelize.transaction(async (t) => {
        await notAssignedMenus.forEach((item: any) => {
            RoleAccess.destroy({
                where: {
                    [Op.and]: [
                        {
                            roleId: roleId
                        },
                        {
                            menuId: item.menuId
                        }
                    ]
                },
                transaction: t
            })
        })
        const newRoles = await RoleAccess.bulkCreate(newAssignedMenus, {validate: true, ignoreDuplicates: true, transaction: t})
        return newRoles
    })
    return result
}