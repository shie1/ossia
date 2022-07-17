import excuteQuery from "./mysql"

export const valideateInviteCode = async (code: string) => {
    return typeof (await excuteQuery("SELECT `code` FROM `invites` WHERE (`code` = ? and `user` is null);",[code]))[0] !== "undefined"
}