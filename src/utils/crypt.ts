import * as crypto from "crypto"

export const hash = (data: any) => {
    let salt = crypto.randomBytes(16).toString('base64')
    let hash = crypto.createHmac('sha512', salt).update(data).digest('base64')
    return salt + '$' + hash
}

export const checkHash = (hashed: any, plain: any) => {
    let passwordField = hashed.split('$')
    let salt = passwordField[0]
    let hash = crypto.createHmac('sha512', salt).update(plain).digest('base64')
    let match: boolean = hash == passwordField[1]
    return match
}