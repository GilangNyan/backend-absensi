export const getPagingData = (data: any, page: number, limit: number) => {
    const rows: any = data.rows
    const totalItems: number = data.count
    const currentPage: number = page
    const totalPages: number = Math.ceil(totalItems / limit)
    return { rows, totalItems, currentPage, totalPages }
}