import { Op, Sequelize } from "sequelize"
import Holiday from "../models/holidayModel"
import { getPagingData } from "../utils/utility"
import { getConfigByKeyService } from "./configService"

export const getHolidayService = async (limit: number, offset: number, search: string) => {
    let result = await Holiday.findAndCountAll({
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
    let response: any = getPagingData(result, offset, limit)
    return response
}

export const getHolidayByIdService = async (id: string) => {
    const result = await Holiday.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    return result
}

export const getHolidayByDateService = async (date: string) => {
    const result = await Holiday.findOne({
        where: {
            date: date
        }
    })
    return result
}

export const createHolidayService = async (name: string, date: string, description: string) => {
    const result = await Holiday.create({
        name: name,
        date: date,
        description: description
    })
    return result
}

export const updateHolidayService = async (id: string, updatedData: { name: string, date: string, description: string }) => {
    const result = await Holiday.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    await result.update(updatedData)
    return result
}

export const deleteHolidayService = async (id: string) => {
    const result = await Holiday.findByPk(id)
    if (!result) {
        throw new Error('Not found')
    }
    await result.destroy()
    return result
}

export const syncHolidayService = async (): Promise<any> => {
    const dayOffApi = 'https://dayoffapi.vercel.app/api'
    return fetch(dayOffApi).then(response => {
        if (!response.ok) {
            throw new Error('Request failed')
        }
        return response.json()
    }).then(async data => {
        const localData = await Holiday.findAll()
        data.forEach(async (el: any) => {
            const existingData = localData.find(items => {
                return el.tanggal == items.date
            })
            if (existingData) {
                if (existingData.description !== el.keterangan) {
                    await Holiday.update({
                        name: el.keterangan,
                        date: el.tanggal,
                        description: el.keterangan
                    },
                    {
                        where: {
                            id: existingData.id
                        }
                    })
                }
            } else {
                await Holiday.create({
                    name: el.keterangan,
                    date: el.tanggal,
                    description: el.keterangan
                })
            }
        });
        return { message: 'Synchronization Success|Sinkronisasi Berhasil' }
    }).catch(error => {
        throw error
    })
}

export const getAllDayOffByRangeService = async (startDate: Date, endDate: Date): Promise<number> => {
    const saturday = await getConfigByKeyService('is-saturday-off')
    const isSaturdayOff = saturday.dataValues.value === 'true'
    const excludedDay = [0] // 0 = minggu, 6 = sabtu
    if (isSaturdayOff) {
        excludedDay.push(6)
    }
    const result = await Holiday.count({
        // attributes: [
        //     [Sequelize.fn('COUNT', Sequelize.col('id')), 'total']
        // ],
        where: {
            date: {
                [Op.between]: [startDate, endDate]
            },
            [Op.and]: Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('DOW FROM "date"')), {
                [Op.notIn]: excludedDay
            })
        }
    })
    const weekend = countWeekends(startDate, endDate, isSaturdayOff)
    return result + weekend
}

const countWeekends = (startDate: Date, endDate: Date, saturday: boolean): number => {
    let count = 0
    let currentDate = startDate
    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay()
        if (dayOfWeek === 0 || (saturday ? dayOfWeek === 6 : false)) {
            count++
        }
        currentDate.setDate(currentDate.getDate() + 1)
    }
    return count
}