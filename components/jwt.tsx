import { getCookie } from "cookies-next"
import { verify } from "jsonwebtoken"

export const getJWT: any = (req: any, res: any) => {
    const token = getCookie("token", { req: req, res: res, path: "/", httpOnly: true })
    if (!token) { return false }
    try {
        const jwt = verify(token as string, process.env["OSSIA_PRIVATE_KEY"] as string)
        return jwt
    } catch {
        return false
    }
}