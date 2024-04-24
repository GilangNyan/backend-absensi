import { Op } from "sequelize"
import Employee from "../models/employeeModel"
import User from "../models/userModel"
import { getPagingData } from "../utils/utility"

export const getEmployeeService = async (limit: number, offset: number, search: string) => {
    let employees = await Employee.findAndCountAll({
        limit: limit,
        offset: (offset - 1) * limit,
        where: {
            [Op.or]: [
                {
                    nip: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    fullname: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    birthPlace: {
                        [Op.iLike]: `%${search}%`
                    }
                }
            ]
        },
        include: User
    })
    let response: any = getPagingData(employees, offset, limit)
    return response
}

export const getEmployeeByIdService = async (id: string) => {
    const employee = await Employee.findByPk(id)
    if (!employee) {
        throw new Error('Not found')
    }
    return employee
}

export const createEmployeeService = async (nip: string, fullname: string, gender: string, birthPlace: string, birthDate: string, userId: string) => {
    const employee = await Employee.create({
        nip: nip,
        fullname: fullname,
        gender: gender,
        birthPlace: birthPlace,
        birthDate: birthDate,
        userId: userId
    })
    return employee
}

export const updateEmployeeService = async (id: string, updatedData: { nip: string, fullname: string, gender: string, birthPlace: string, birthDate: string }) => {
    const employee = await Employee.findByPk(id)
    if (!employee) {
        throw new Error('Not found')
    }
    await employee.update(updatedData)
    return employee
}

export const deleteEmployeeService = async (id: string) => {
    const employee = await Employee.findByPk(id)
    if (!employee) {
        throw new Error('Not found')
    }
    await employee.destroy()
    return employee
}