import { Button, Center, Group } from "@mantine/core";
import type { NextPage } from "next";
import { useEffect } from "react";
import { Home } from "tabler-icons-react";
import { useIconSelector } from "../components/icons";

const Test: NextPage = () => {
    const iSel = useIconSelector()
    return (<Group position="center" direction="column">
        {iSel.modal}
        <Button leftIcon={iSel.icon} onClick={() => { iSel.open() }}>Open icon selector</Button>
    </Group>)
}

export default Test