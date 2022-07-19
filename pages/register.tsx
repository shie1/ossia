import {
    Box,
    Button,
    Collapse,
    Container,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
} from "@mantine/core";
import type { NextPage } from "next";
import { useForm } from "@mantine/form"
import { interactive } from "../components/styles";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { useEffect, useState } from "react";
import { useModals } from "@mantine/modals";
import { Action } from "../components/action";
import { ArrowBackUp, Check, Clipboard } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { apiCall } from "../components/api";
import { useRouter } from "next/router";
import Head from "next/head";
import { localized } from "../components/localization";

function caesar(str: string, num: number) {
    var result = '';
    var charcode = 0;
    for (var i = 0; i < str.length; i++) {
        charcode = ((str[i].charCodeAt(0)) + num) % 65535;
        result += String.fromCharCode(charcode);
    }
    return result;
}

const BuyCode = ({ clientId, form }: { clientId: string, form: any }) => {
    const modals = useModals()
    const [restore, setRestore] = useState(false)
    const [orderId, setOrderId] = useState("")
    const doneOrder = (details: any) => {
        apiCall("POST", "/api/invite", { details: JSON.stringify(details) }).then(hash => {
            if (hash) {
                form.setFieldValue("inviteCode", hash[0])
                const reply = modals.openModal({
                    title: localized.inviteCode, children:
                        <Group spacing="sm" grow direction="column">
                            <Group spacing={2} grow direction="column">
                                <Text>{localized.formatString(localized.orderResp!, hash[1])}</Text>
                                <TextInput size="lg" rightSection={<Group mr="md"><Action onClick={() => {
                                    window.navigator.clipboard.writeText(hash[0])
                                    showNotification({ title: localized.copiedToClipboard, message: "", icon: <Clipboard /> })
                                }} label={localized.copyToClipboard}><Clipboard /></Action></Group>} value={hash[0]} />
                            </Group>
                            <Group spacing={6} position="right">
                                <Button onClick={() => {
                                    modals.closeModal(reply)
                                }} variant="light">{localized.close}</Button>
                            </Group>
                        </Group>
                })
            }
        })
    }
    return (<PayPalScriptProvider options={{ "client-id": clientId }}>
        <Container>
            <Group position="center" direction="row" my="sm">
                <Group sx={{ width: '100%' }} align="center" spacing={6}>
                    <Text align="left" size="xl">1.99$ | {localized.inviteCode}</Text>
                    <Text>{localized.inviteSalesPitch}</Text>
                </Group>
                <Group >
                    <Paper p="sm" pb={0} withBorder sx={(theme) => ({ background: theme.colors.gray[0] })}>
                        <PayPalButtons className="paypal-buttons-container" style={{ shape: "pill", color: "black" }} createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: "1.99",
                                        },
                                    },
                                ],
                            });
                        }}
                            onApprove={async (data, actions) => {
                                return actions.order?.capture().then((details) => {
                                    doneOrder(details)
                                });
                            }} />
                    </Paper>
                </Group>
                <Group sx={interactive} onClick={() => { setRestore(!restore) }}><Text mt={-6} size="sm" >{restore ? localized.backToOrder : localized.restorePurchase}</Text></Group>
            </Group>
            <Collapse in={restore}>
                <form onSubmit={async (e) => {
                    e.preventDefault()
                    apiCall("POST", "/api/restoreinvite", { i: orderId }).then(resp => {
                        if (resp) {
                            form.setFieldValue("inviteCode", resp)
                            const reply = modals.openModal({
                                title: localized.inviteCode, children:
                                    <Group spacing="sm" grow direction="column">
                                        <Group spacing={2} grow direction="column">
                                            <Text>{localized.yourCodeIs}</Text>
                                            <TextInput size="lg" rightSection={<Group mr="md"><Action onClick={() => {
                                                window.navigator.clipboard.writeText(resp)
                                                showNotification({ title: localized.copiedToClipboard, message: "", icon: <Clipboard /> })
                                            }} label={localized.copyToClipboard}><Clipboard /></Action></Group>} value={resp} />
                                        </Group>
                                        <Group spacing={6} position="right">
                                            <Button onClick={() => {
                                                modals.closeModal(reply)
                                            }} variant="light">{localized.close}</Button>
                                        </Group>
                                    </Group>
                            })
                        }
                    })
                }}>
                    <TextInput placeholder="8X183i26Jr596b63Y" size="sm" label={localized.orderId} value={orderId} onChange={(e) => setOrderId(e.currentTarget.value)} rightSection={
                        <Action mr={2} size="md" label={localized.restore} type="submit"><ArrowBackUp /></Action>
                    } />
                </form>
            </Collapse>
        </Container>
    </PayPalScriptProvider >)
}

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
        const salt = Number(`${(new Date().getDate())}67${(new Date().getMonth())}`)
        let password = caesar(values["password"], salt)
        apiCall("POST", "/api/user/create", { username: values.username, password: password, inviteCode: values.inviteCode }).then(resp => {
            if (!resp) { setCodeError(true) } else {
                router.replace(`/login?u=${values.username}`)
                showNotification({ 'title': localized.registrationSuccessful, "message": localized.youMayNowLogin, icon: <Check /> })
            }
        })
    }

    useEffect(() => {
        setAvailable(null)
        apiCall("POST", "api/user/available", { username: form.values.username }).then(resp => {
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
                        <Button variant="light" size="lg" type="submit">{localized.register}</Button>
                        <Group onClick={() => { buy[1](!buy[0]) }} sx={interactive}><Text size="sm" >{buy[0] ? localized.buyInviteClose : localized.buyInviteClose}</Text></Group>
                    </Group>
                </form>
            </Box>
            <Collapse in={buy[0]}>
                <Box sx={{ maxWidth: 300 }}>
                    <BuyCode form={form} clientId={props["PAYPAL_ID"]} />
                </Box>
            </Collapse>
        </Group>
    </Container>)
}

export function getServerSideProps() {
    require('dotenv').config()
    return { props: { PAYPAL_ID: process.env["PAYPAL_ID"] } }
}

export default Register