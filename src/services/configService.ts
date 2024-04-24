import { Op } from "sequelize"
import Config from "../models/configModel"
import { getPagingData } from "../utils/utility"

export const getConfigService = async (limit: number, offset: number, search: string) => {
    let configs = await Config.findAndCountAll({
        limit: limit,
        offset: (offset - 1) * limit,
        where: {
            [Op.or]: [
                {
                    key: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    value: {
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
    let response: any = getPagingData(configs, offset, limit)
    return response
}

export const getConfigByIdService = async (id: string) => {
    const config = await Config.findByPk(id)
    if (!config) {
        throw new Error('Not found')
    }
    return config
}

export const getConfigByKeyService = async (key: string) => {
    const config = await Config.findOne({
        where: {
            key: key
        }
    })
    if (!config) {
        throw new Error('Not found')
    }
    return config
}

export const createConfigService = async (key: string, value: string, description: string) => {
    const config = await Config.create({
        key: key,
        value: value,
        description: description
    })
    return config
}

export const updateConfigService = async (id: string, updatedData: { key: string, value: string, description: string }) => {
    const config = await Config.findByPk(id)
    if (!config) {
        throw new Error('Not found')
    }
    await config.update(updatedData)
    return config
}

export const deleteConfigService = async (id: string) => {
    const config = await Config.findByPk(id)
    if (!config) {
        throw new Error('Not found')
    }
    await config.destroy()
    return config
}