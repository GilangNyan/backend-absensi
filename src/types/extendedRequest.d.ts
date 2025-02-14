import { Request } from "express"

interface reqParams {}

interface resBody {}

interface reqBody {}

interface reqQuery {
    page: string
    perPage: string
    id: string
    search: string
    sort: string
    dir: string
    grade: string
    nisn: string
    year: string
    month: string
    date: string
    type: string
    semester: string
}

interface ExtendedRequest extends Request {
    query: reqQuery
    jwt?: any
}

export default ExtendedRequest