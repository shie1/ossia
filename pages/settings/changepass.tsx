import { Button, Container, Group, PasswordInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Check } from "tabler-icons-react";
import { apiCall } from "../../components/api";
import { localized } from "../../components/localization";

function caesar(str: string, num: number) {
    var result = '';
    var charcode = 0;
    for (var i = 0; i < str.length; i++) {
        charcode = ((str[i].charCodeAt(0)) + num) % 65535;
        result += String.fromCharCode(charcode);
    }
    return result;
}

const ChangePass: NextPage = (props: any) => {
    const router = useRouter()
    const [error, setError] = useState("")
    const form = useForm({
        initialValues: {
            currPass: '',
            newPass1: '',
            newPass2: ''
        },
        validate: {
            currPass: (val) => ((/^\s*$/.test(val) || val.length === 0) ? localized.cannotBeEmpty : null),
            newPass1: (val) => (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(val) ? null : localized.weakPassword),
            newPass2: (val, vals) => val === vals.newPass1 ? null : localized.passwordConfirmError
        }
    })

    useEffect(() => {
        if (!props.me) {
            router.replace("/")
        }
    }, [router])

    const chP = (values: any) => {
        const c = Number(`${(new Date().getDate())}67${(new Date().getMonth())}`)
        const password = caesar(values.currPass, c)
        const newPassword = caesar(values.newPass1, c)
        apiCall("POST", "/api/user/change", { username: values.username, password, newPassword, }).then(resp => {
            if (resp) {
                showNotification({ 'title': localized.success, message: localized.passwordChangeResp, icon: <Check /> })
                router.replace("/")
            } else {
                setError(localized.passwordChangeErr!)
            }
        })
    }

    useEffect(() => {
        setError("")
    }, [form.values.currPass])

    return (<Container>
        <Head>
            <title>Change Password | Ossia</title>
        </Head>
        <Title mb="lg">{localized.changePass}</Title>
        {props.me && <form onSubmit={form.onSubmit((values) => chP(values))}>
            <Group spacing="sm" direction="column">
                <PasswordInput error={error} autoComplete="current-password" sx={{ width: '100%' }} size="lg" label={localized.currentPass} {...form.getInputProps("currPass")} />
                <PasswordInput autoComplete="new-password" sx={{ width: '100%' }} size="lg" label={localized.newPassword} {...form.getInputProps("newPass1")} />
                <PasswordInput autoComplete="new-password" sx={{ width: '100%' }} size="lg" label={localized.newPassword} {...form.getInputProps("newPass2")} />
                <Button variant="light" type="submit">{localized.change}</Button>
            </Group>
        </form>}
    </Container>)
}

export default ChangePass