import { Op } from "sequelize"
import Student from "../models/studentModel"
import { getPagingData } from "../utils/utility"
import AcademicYear from "../models/academicYearModel"
import Grade from "../models/gradeModel"
import StudentGrade from "../models/studentGradeModel"
import Sorting from "../types/sorting"
import sequelize from "sequelize"

export const getStudentService = async (limit: number, offset: number, search: string, sorting: Sorting, grade: string) => {
    let isGradeRequired = false
    const academicYear = null
    let isAcademicYearRequired = false
    let gradeCondition: any = {}
    let academicYearCondition: any = {}
    if (academicYear) {
        academicYearCondition.id = academicYear
    }
    if (grade != undefined || grade != null) {
        if (grade != 'no-grade') {
            gradeCondition.id = grade
            isGradeRequired = true
            isAcademicYearRequired = true
        }
    }
    let studentSort: any[] = []
    let gradeSort: any[] = []
    if (sorting.sort == 'grade') {
        gradeSort.push([sorting.sort, sorting.dir])
    } else {
        studentSort.push([sorting.sort, sorting.dir])
    }
    let students = await Student.findAndCountAll({
        limit: limit,
        offset: (offset - 1) * limit,
        where: {
            [Op.or]: [
                {
                    nisn: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    nipd: {
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
        order: studentSort,
        include: [
            {
                model: Grade,
                where: gradeCondition,
                required: isGradeRequired
            },
            {
                model: AcademicYear,
                where: academicYearCondition,
                required: isAcademicYearRequired
            }
        ]
    })
    if (grade == 'no-grade') {
        students.rows = students.rows.filter((item: any) => {
            return item.grades.length === 0
        })
        students.count = students.rows.length
    }
    let response: any = getPagingData(students, offset, limit)
    return response
}

export const getStudentByIdService = async (id: string) => {
    const student = await Student.findByPk(id)
    if (!student) {
        throw new Error('Not found')
    }
    return student
}

export const createStudentsService = async (nisn: string, nipd: string, fullname: string, gender: string, birthPlace: string, birthDate: string) => {
    const result = await Student.create({
        nipd: nipd,
        nisn: nisn,
        fullname: fullname,
        gender: gender,
        birthPlace: birthPlace,
        birthDate: birthDate
    })
    return result
}

export const updateStudentsService = async (id: string, updatedData: {nisn: string, nipd: string, fullname: string, gender: string, birthPlace: string, birthDate: string}) => {
    const result = await Student.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    await result.update(updatedData)
    return result
}

export const deleteStudentsService = async (id: string) => {
    const result = await Student.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    await result.destroy()
    return result
}

export const createBatchStudentsService = async (students: any[]) => {
    const result = await Student.bulkCreate(students, {
        ignoreDuplicates: true
    })
    return result
}