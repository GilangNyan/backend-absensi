import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { sequelize, testConnection } from './config/database'
import { routes } from './routes'
import { runAllCronOnServiceStart } from './crons'

dotenv.config()

const StartServer = async () => {
    const app = express()
    const port = process.env.PORT || 3000

    // Test Connection
    await testConnection()

    app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.use(cors({
        origin: ["http://localhost:5173"],
        credentials: true
    }))

    // Routes
    app.use('/absensi/api/', routes)

    // Sync Database
    sequelize.sync()

    // Cron Jobs
    runAllCronOnServiceStart()

    // Run Server
    app.listen(port, () => {
        console.log(`Server berjalan di port ${port}`)
    }).on('error', err => {
        console.error(err)
        process.exit()
    })
}

StartServer()