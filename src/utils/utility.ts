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