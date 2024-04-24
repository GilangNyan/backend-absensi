import * as cron from 'node-cron'
import { createAcademicYearService } from '../services/academicYearService'
import { getConfigByKeyService } from '../services/configService'

const runOnServiceStart = async (firstMonth: string) => {
    try {
        console.log('Running check on Academic Year on service start...')
        await createAcademicYearService(firstMonth)
    } catch (error) {
        console.error('Academic Year check error:', error)
    }
}

export const academicYearCron = async () => {
    const sysParam = getConfigByKeyService('first-academic-month')
    runOnServiceStart((await sysParam).dataValues.value)
    let cronSchedule = `0 0 0 1 ${parseInt((await sysParam).dataValues.value) + 1} *`
    cron.schedule(cronSchedule, async () => {
        try {
            console.log('Running cron to sync Academic Year data...')
            await createAcademicYearService((await sysParam).dataValues.value)
        } catch (error) {
            console.error('Academic Year cron job error:', error)
        }
    })
    
    console.log('Cron job for Academic Year scheduled')
}