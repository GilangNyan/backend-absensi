import * as dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

dotenv.config()

const db = process.env.DB_NAME || 'db_absensi'
const user = process.env.DB_USER || 'postgres'
const password = process.env.DB_PASSWORD || ''

export const sequelize = new Sequelize(db, user, password, {
    host: process.env.DB_HOST,
    dialect:'postgres'
})

export const testConnection = async (): Promise<void> => {
    try {
        await sequelize.authenticate()
    } catch (error) {
        console.error("Database belum terkoneksi:", error)
    }
}