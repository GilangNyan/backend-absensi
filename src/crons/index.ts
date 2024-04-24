import { academicYearCron } from "./academicYearCron"

export const runAllCronOnServiceStart = async () => {
    try {
        console.log('Running cron on service start...')
        // Import semua fungsi cron di sini
        await academicYearCron()
    } catch (error) {
        console.error('Error running cron on service start:', error)
    }
}