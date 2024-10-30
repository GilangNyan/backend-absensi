export const getPagingData = (data: any, page: number, limit: number) => {
    const rows: any = data.rows
    const totalItems: number = data.count
    const currentPage: number = page
    const totalPages: number = Math.ceil(totalItems / limit)
    return { rows, totalItems, currentPage, totalPages }
}

export const getRandomString = (length: number): string => {
    let result = ''
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charLength = char.length
    let counter = 0
    while (counter < length) {
        result += char.charAt(Math.floor(Math.random() * charLength))
        counter += 1
    }
    return result
}

export const getStartEndDate = (date: string, isEndDate: boolean = false) => {
    const inputtedDate = new Date(date)
    if (isEndDate) {
        inputtedDate.setHours(23, 59, 59, 999)
    } else {
        inputtedDate.setHours(0, 0, 0, 0)
    }
    return inputtedDate
}

export const getTotalDaysByMonth = (year: number, month: number): number => {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const timeDiff = endDate.getTime() - startDate.getTime()

    const dayDiff = timeDiff / (1000 * 3600 * 24)

    return dayDiff + 1
}