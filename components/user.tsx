import { pbkdf2Sync } from "crypto"
import executeQuery from "./mysql"

export const usernameAvailable = async (user: string) => {
    return typeof (await executeQuery("SELECT `username` FROM `users` WHERE (`username` = ?);", [user]))[0] === "undefined"
}

export const validatePassword = (username: string, password: string) => {
    return new Promise(async (resolve, reject) => {
        executeQuery("SELECT `salt` FROM `users` WHERE (`username` = ?);", [username]).then(salt => {
            if (!salt[0]) { return resolve(false) }
            salt = salt[0].salt
            const hash = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
            executeQuery("SELECT * FROM `users` WHERE (`username` = ? and `password` = ? and `salt` = ?);", [username, hash, salt]).then(resp => {
                if (typeof resp[0] !== "undefined") {
                    return resolve(true)
                } else {
                    return resolve(false)
                }
            })
        })
    })
}