import { AspectRatio, Center, Container, Group, Image, Text, Title } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import { localized } from "../components/localization";

const Page404: NextPage = () => {
    return (<Container sx={{ height: '100%' }}>
        <Head>
            <title>404: Page not found!</title>
        </Head>
        <Group position="center" align="center" sx={{ height: '90%' }} direction="row">
            <Center mx={10}>
                <Image imageProps={{ draggable: false }} alt="Sad robot on tower" sx={{ width: '32vh' }} src="/sad_robot.svg" />
            </Center>
            <Group mx={30} direction="column" spacing={4}>
                <Title sx={{ fontSize: '3rem' }}>404</Title>
                <Text size="xl">{localized.pageNotFound}</Text>
            </Group>
        </Group>
    </Container>)
}

export default Page404