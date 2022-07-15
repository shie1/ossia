import { Box, Button, Container, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import type { NextPage } from "next";
import { useForm } from "@mantine/form"
import Link from "next/link";
import { interactive } from "../components/styles";

function caesar(str: string, num: number) {
    var result = '';
    var charcode = 0;
    for (var i = 0; i < str.length; i++) {
        charcode = ((str[i].charCodeAt(0)) + num) % 65535;
        result += String.fromCharCode(charcode);
    }
    return result;
}

const Register: NextPage = () => {
    const form = useForm({
        initialValues: {
            username: '',
            password: '',
            inviteCode: ''
        },
        validate: {
            password: (val) => (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(val) ? null : "This password is too weak!"),
            inviteCode: (val) => (/[0-z]{8}/.test(val) ? null : 'Invite code invalid!'),
            username: (val) => (/^[0-z]{1,16}$/.test(val) ? null : "Username can only contain letters and numbers!")
        }
    })

    const register = (values: any) => {
        const salt = Number(`${(new Date().getDate())}67${(new Date().getMonth())}`)
        let password = caesar(values["password"], salt)
        console.log({ ...values, password })
    }

    return (<Container>
        <Box sx={{ maxWidth: 300 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => register(values))}>
                <Group spacing="sm" grow direction="column">
                    <TextInput maxLength={16} description="You can't change this later." required {...form.getInputProps("username")} label="Username" size="lg" />
                    <PasswordInput description={<ul style={{ margin: 0, padding: 0, paddingLeft: '1em' }}><li>8 chars</li><li>Must contain lower and upper case</li><li>Must contain a number</li></ul>} required {...form.getInputProps("password")} label="Password" size="lg" />
                    <TextInput maxLength={8} description="A code you can get from a registered user, or by purchasing one." required {...form.getInputProps("inviteCode")} label="Invite code" size="lg" />
                    <Button variant="light" size="lg" type="submit">Register</Button>
                    <Text size="sm" sx={interactive}><Link href="/buy">Don&apos;t have an invite?</Link></Text>
                </Group>
            </form>
        </Box>
    </Container>)
}

export default Register