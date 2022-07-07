import { showNotification } from "@mantine/notifications"
import { AlertCircle, Code } from "tabler-icons-react"
import { localized } from "./localization"

export const wip = () => { showNotification({ 'title': localized.wip, 'message': '', icon: <Code /> }) }