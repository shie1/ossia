import { Box, Button, Center, Collapse, Container, Group, Paper, PasswordInput, Text, TextInput } from "@mantine/core";
import type { NextPage } from "next";
import { useForm } from "@mantine/form"
import Link from "next/link";
import { interactive } from "../components/styles";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { useEffect, useState } from "react";
import md5 from "md5";
import { useModals } from "@mantine/modals";
import { useHotkeys } from "@mantine/hooks";
import { Action } from "../components/action";
import { localized } from "../components/localization";
import { Clipboard } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { apiCall } from "../components/api";

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
    const doneOrder = (details: any) => {
        const date = new Date()
        const salt = 42
        const plain = `${date.getDay() + salt}${date.getMonth() + (salt / 2)}`
        const sig = md5(plain)
        apiCall("POST", "/api/invite", { sig: sig, details: JSON.stringify(details) }).then(hash => {
            const reply = modals.openModal({
                title: "Invite code", children:
                    <Group spacing="sm" grow direction="column">
                        <Group spacing={2} grow direction="column">
                            <Text>Your purchase has been successful, your code is:</Text>
                            <TextInput size="lg" rightSection={<Group mr="md"><Action onClick={() => {
                                window.navigator.clipboard.writeText(hash)
                                showNotification({ title: "Copied to clipboard!", message: "", icon: <Clipboard /> })
                            }} label="Copy to clipboard"><Clipboard /></Action></Group>} value={hash} />
                        </Group>
                        <Group spacing={6} position="right">
                            <Button onClick={() => {
                                form.setFieldValue("inviteCode", hash)
                                modals.closeModal(reply)
                            }} variant="light">Use code</Button>
                        </Group>
                    </Group>
            })
        })
    }
    return (<PayPalScriptProvider options={{ "client-id": clientId }}>
        <Container>
            <Group position="center" direction="row" my="sm">
                <Group sx={{ width: '100%' }} align="center" spacing={6}>
                    <Text align="left" size="xl">1.99$ | Invite code</Text>
                    <Text>With this one time purchase, you can register to Ossia and get access to all of the features our application has to offer.</Text>
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
            </Group>
        </Container>
    </PayPalScriptProvider>)
}

const Register: NextPage = (props: any) => {
    const buy = useState(false)
    const iv = useState("")
    const form = useForm({
        initialValues: {
            username: '',
            password: '',
            inviteCode: ''
        },
        validate: {
            password: (val) => (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(val) ? null : "This password is too weak!"),
            inviteCode: (val) => (/[0-z]{7}/.test(val) ? null : 'Invite code invalid!'),
            username: (val) => (/^[0-z]{1,16}$/.test(val) ? null : "Username can only contain letters and numbers!")
        }
    })

    const register = (values: any) => {
        const salt = Number(`${(new Date().getDate())}67${(new Date().getMonth())}`)
        let password = caesar(values["password"], salt)
    }

    return (<Container>
        <Group spacing="xl" position="center" align="center">
            <Box sx={{ maxWidth: 300 }}>
                <form onSubmit={form.onSubmit((values) => register(values))}>
                    <Group spacing="sm" grow direction="column">
                        <TextInput maxLength={16} description="You can't change this later." required {...form.getInputProps("username")} label="Username" size="lg" />
                        <PasswordInput description={<ul style={{ margin: 0, padding: 0, paddingLeft: '1em' }}><li>8 chars</li><li>Must contain lower and upper case</li><li>Must contain a number</li></ul>} required {...form.getInputProps("password")} label="Password" size="lg" />
                        <TextInput maxLength={8} description="A code you can get from a registered user, or by purchasing one." required {...form.getInputProps("inviteCode")} label="Invite code" size="lg" />
                        <Button variant="light" size="lg" type="submit">Register</Button>
                        <Group onClick={() => { buy[1](!buy[0]) }} sx={interactive}><Text size="sm" >{buy[0] ? "Already have an invite?" : "Don't have an invite?"}</Text></Group>
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