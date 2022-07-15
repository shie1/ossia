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

const Login: NextPage = () => {
    const form = useForm({
        initialValues: {
            username: '',
            password: '',
        },
    })

    const login = (values: any) => {
        const salt = Number(`${(new Date().getDate())}67${(new Date().getMonth())}`)
        let password = caesar(values["password"], salt)
        console.log({ ...values, password })
    }

    return (<Container>
        <Box sx={{ maxWidth: 300 }} mx="auto">
            <form onSubmit={form.onSubmit((values) => login(values))}>
                <Group spacing="sm" grow direction="column">
                    <TextInput maxLength={16} required {...form.getInputProps("username")} label="Username" size="lg" />
                    <PasswordInput required {...form.getInputProps("password")} label="Password" size="lg" />
                    <Button variant="light" size="lg" type="submit">Login</Button>
                    <Text size="sm" sx={interactive}><Link href="/register">Don&apos;t have an account yet?</Link></Text>
                </Group>
            </form>
        </Box>
    </Container>)
}

export default Login