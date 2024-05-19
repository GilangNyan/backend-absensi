import { Op } from "sequelize"
import Grade from "../models/gradeModel"
import { getPagingData } from "../utils/utility"
import StudentGrade from "../models/studentGradeModel"
import Student from "../models/studentModel"

export const getGradeService = async (limit: number, offset: number, search: string) => {
    const grades = await Grade.findAndCountAll({
        limit: limit,
        offset: (offset - 1) * limit,
        where: {
            name: {
                [Op.iLike]: `%${search}%`
            }
        },
        include: {
            model: Student
        },
        order: [
            ['name', 'ASC']
        ]
    })
    const response: any = getPagingData(grades, offset, limit)
    return response
}

export const getGradeByIdService = async (id: string) => {
    const grade = await Grade.findByPk(id)
    if (!grade) {
        throw new Error('Not found')
    }
    return grade
}

export const createGradeService = async (name: string) => {
    const grade = await Grade.create({
        name: name
    })
    return grade
}

export const updateGradeService = async (id: string, updatedData: { name: string }) => {
    const grade = await Grade.findByPk(id)
    if (!grade) {
        throw new Error('Not found')
    }
    await grade.update(updatedData)
    return grade
}

export const deleteGradeService = async (id: string) => {
    const grade = await Grade.findByPk(id)
    if (!grade) {
        throw new Error('Not found')
    }
    await grade.destroy()
    return grade
}