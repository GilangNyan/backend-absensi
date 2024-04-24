import { Op } from "sequelize"
import AcademicYear from "../models/academicYearModel"
import { getPagingData } from "../utils/utility"

interface IAcademicYearFilter {
    startDate: string
    endDate: string
}

export const getAcademicYearService = async (limit: number, offset: number, search: string) => {
    let academicYear = await AcademicYear.findAndCountAll({
        limit: limit,
        offset: (offset - 1) * limit,
        where: {
            [Op.or]: [
                {
                    name: {
                        [Op.iLike]: `%${search}%`
                    }
                }
            ]
        },
        order: [
            ['createdAt', 'DESC']
        ]
    })
    let response: any = getPagingData(academicYear, offset, limit)
    return response
}

export const getAcademicYearByIdService = async (id: string) => {
    const academicYear = await AcademicYear.findByPk(id)
    if (!academicYear) {
        throw new Error('Not found')
    }
    return academicYear
}

export const getRecentAcademicYearService = async () => {
    const academicYear = await AcademicYear.findOne({
        where: {
            status: 'A'
        },
        order: [
            ['createdAt', 'DESC']
        ]
    })
    return academicYear
}

export const createAcademicYearService = async (firstMonth: string) => {
    const currentDate = new Date()
    const startDate = new Date(new Date().getFullYear(), parseInt(firstMonth), 1)
    const endDate = new Date(new Date().getFullYear() + 1, parseInt(firstMonth), 0)
    endDate.setHours(23, 59, 59)
    const academicYearName = `${startDate.getFullYear()}/${endDate.getFullYear()}`

    // Cek jika academic year berjalan jika db masih kosong
    const oldStartDate = new Date(startDate.getFullYear() - 1, startDate.getMonth(), startDate.getDate())
    const oldEndDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate())
    oldEndDate.setHours(23, 59, 59)
    const oldAcademicYearName = `${oldStartDate.getFullYear()}/${oldEndDate.getFullYear()}`

    const isAcademicYearExist = await getAcademicYearByDateService(startDate, endDate)
    const isMonthlyCronSchedule = currentDate.getMonth() === parseInt(firstMonth)
    const isOldAcademicYearExist = await getAcademicYearByDateService(oldStartDate, oldEndDate)

    if (isAcademicYearExist === null) {
        if (isMonthlyCronSchedule) {
            const academicYear = await AcademicYear.create({
                name: academicYearName,
                startDate: startDate,
                endDate: endDate,
                status: 'A'
            })
            await deactivateOldAcademicYearService(startDate, endDate)
            console.info('New academic year created')
            return academicYear
        } else if (isOldAcademicYearExist === null) {
            const academicYear = await AcademicYear.create({
                name: oldAcademicYearName,
                startDate: oldStartDate,
                endDate: oldEndDate,
                status: 'A'
            })
            // await deactivateOldAcademicYearService(startDate, endDate)
            console.info('New academic year created')
            return academicYear
        }
    } else {
        console.info('Academic year already exist')
        return isAcademicYearExist
    }
}

// Private Functions
const getAcademicYearByDateService = async (startDate: Date, endDate: Date) => {
    const academicYear = await AcademicYear.findOne({
        where: {
            startDate: startDate,
            endDate: endDate
        }
    })
    return academicYear
}

const deactivateOldAcademicYearService = async (startDate: Date, endDate: Date) => {
    const academicYear = await AcademicYear.update({
        status: 'I'
    }, {
        where: {
            startDate: {
                [Op.ne]: startDate
            },
            endDate: {
                [Op.ne]: endDate
            }
        }
    })
    return academicYear
}