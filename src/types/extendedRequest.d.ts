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
}

interface ExtendedRequest extends Request {
    query: reqQuery
    jwt?: any
}

export default ExtendedRequest