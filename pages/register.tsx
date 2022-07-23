import {
    Box,
    Button,
    Checkbox,
    Container,
    Group,
    PasswordInput,
    Text,
    TextInput,
    TypographyStylesProvider,
} from "@mantine/core";
import type { NextPage } from "next";
import { useForm } from "@mantine/form"
import { useEffect, useState } from "react";
import { Check } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { apiCall } from "../components/api";
import { useRouter } from "next/router";
import Head from "next/head";
import { localized } from "../components/localization";
import Link from "next/link";

const Register: NextPage = (props: any) => {
    const buy = useState(false)
    const [available, setAvailable] = useState<boolean | null>(null)
    const [codeError, setCodeError] = useState(false)
    const router = useRouter()
    const form = useForm({
        initialValues: {
            username: '',
            password: '',
            inviteCode: ''
        },
        validate: {
            password: (val) => (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(val) ? null : localized.weakPassword),
            inviteCode: (val) => (/[0-z]{7}/.test(val) ? null : localized.inviteCodeInvalid),
            username: (val) => (/^[0-z]{1,20}$/.test(val) ? null : localized.usernameInvalid)
        }
    })

    const register = (values: any) => {
        if (available === false || available === null) { return }
        let password = values["password"]
        apiCall("POST", "/api/user/create", { username: values.username, password: password, inviteCode: values.inviteCode }).then(resp => {
            if (!resp) { setCodeError(true) } else {
                router.replace(`/login?u=${values.username}`)
                showNotification({ 'title': localized.registrationSuccessful, "message": localized.youMayNowLogin, icon: <Check /> })
            }
        })
    }

    useEffect(() => {
        setAvailable(null)
        apiCall("GET", "api/user/available", { username: form.values.username }).then(resp => {
            setAvailable(resp)
        })
    }, [form.values.username])

    useEffect(() => {
        setCodeError(false)
    }, [form.values.inviteCode])

    return (<Container>
        <Head>
            <title>Register | Ossia</title>
        </Head>
        <Group spacing="xl" position="center" align="center">
            <Box sx={{ maxWidth: 300 }}>
                <form onSubmit={form.onSubmit((values) => register(values))}>
                    <Group spacing="sm" grow direction="column">
                        <TextInput autoComplete="off" error={available === false && localized.usernameTaken} maxLength={20} description={localized.usernameDesc} required {...form.getInputProps("username")} label={localized.username} size="lg" />
                        <PasswordInput autoComplete="new-password" description={<ul style={{ margin: 0, padding: 0, paddingLeft: '1em' }}><li>{localized.passwordDesc!.split("\n")[0]}</li><li>{localized.passwordDesc!.split("\n")[1]}</li><li>{localized.passwordDesc!.split("\n")[2]}</li></ul>} required {...form.getInputProps("password")} label={localized.password} size="lg" />
                        <TextInput autoComplete="off" error={codeError && localized.inviteCodeInvalid} maxLength={8} description={localized.inviteCodeDesc} required {...form.getInputProps("inviteCode")} label={localized.inviteCode} size="lg" />
                        <Checkbox required label={<TypographyStylesProvider><Text size="sm">{localized.formatString(localized.registerCheckbox!, <Link href="/legal">{localized.legalSection}</Link>)}</Text></TypographyStylesProvider>} />
                        <Button variant="light" size="lg" type="submit">{localized.register}</Button>
                    </Group>
                </form>
            </Box>
        </Group>
    </Container>)
}

export default Register