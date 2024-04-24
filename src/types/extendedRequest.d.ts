import { Request } from "express"

interface reqParams {}

interface resBody {}

interface reqBody {}

interface reqQuery {
    page: string
    perPage: string
    id: string
    search: string
    filter: string
    sort: string
    dir: string
}

interface ExtendedRequest extends Request {
    query: reqQuery
    jwt?: any
}

export default ExtendedRequest