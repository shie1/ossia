import excuteQuery from "./mysql"

export const usernameAvailable = async (user: string) => {
    return typeof (await excuteQuery("SELECT `username` FROM `users` WHERE (`username` = ?);", [user]))[0] === "undefined"
}