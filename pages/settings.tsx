import { Text, Container, Group, Button, SegmentedControl, Divider } from "@mantine/core";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Database, Network, Palette, SettingsOff } from "tabler-icons-react";
import { Collapse } from "../components";
import { getColorScheme } from "../functions";
import dynamic from 'next/dynamic'
import { useModals } from "@mantine/modals";
import { useLocalStorage } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
const ReactJson = dynamic(import('react-json-view'), { ssr: false });

const Settings: NextPage = () => {
    const [ls, setLs] = useState({})
    const [colorScheme, setTheColorScheme] = useLocalStorage({ 'key': "color-scheme", 'defaultValue': 'dark' });
    const [lowQualityMode, setLowQualityMode] = useLocalStorage<number>({ 'key': 'low-quality-mode', 'defaultValue': 1 })
    const [csm, scsm] = useLocalStorage({ 'key': "color-scheme-mode", 'defaultValue': '0' });

    const setColorScheme = useCallback((value: any) => {
        if (typeof window === 'undefined') { return }
        setTheColorScheme(value)
        if (value) {
            document.documentElement.setAttribute('data-theme', value)
        } else {
            document.documentElement.removeAttribute('data-theme')
        }
    }, [setTheColorScheme])

    useEffect(() => {
        if (typeof window === 'undefined' || Object.keys(ls).length !== 0) { return }
        let locs: any = {}
        for (let item of Object.keys(localStorage)) {
            locs[item] = JSON.parse(localStorage[item])
        }
        setLs(locs)
    }, [ls])

    const modals = useModals();

    const confirm = (callback: any) => {
        modals.openConfirmModal({
            title: 'Please confirm your action',
            children: (
                <Text size="sm">
                    This action is so important that you are required to confirm it with a modal. Please click
                    one of these buttons to proceed.
                </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onConfirm: callback,
        });
    }

    const LSInspect = () => {
        const lsEdit = (e: any) => {
            confirm(() => {
                localStorage.setItem(e.name, JSON.stringify(e.new_value))
                showNotification({
                    'title': `Edited value: ${e.name}`,
                    'message': `You might need to reload for changes to take effect!`,
                    'icon': <Database />
                })
            })
        }

        return <ReactJson onDelete={(e: any) => {
            confirm(() => {
                localStorage.removeItem(e.name)
            })
            showNotification({
                'title': `Deleted value: ${e.name}`,
                'message': `You might need to reload for changes to take effect!`,
                'icon': <Database />
            })
        }} onEdit={lsEdit} name="localStorage" iconStyle="triangle" enableClipboard={true} style={{ width: "100%", whiteSpace: 'pre-wrap', 'wordWrap': 'break-word', 'background': 'unset' }} collapsed={true} collapseStringsAfterLength={50} theme='twilight' src={ls} />
    }

    return (<Container>
        <Text size="lg" mb='sm'>Settings</Text>
        <Group spacing='sm'>
            <Collapse icon={<Palette />} title="Color Scheme">
                <Text>Dark or light mode?</Text>
                <SegmentedControl onChange={(val) => {
                    scsm(val)
                    switch (Number(val)) {
                        case 0:
                            setColorScheme('')
                            break
                        case 1:
                            setColorScheme('dark')
                            break
                        case 2:
                            setColorScheme('light')
                            break
                    }
                }} value={csm} data={[{ 'label': 'Dark', 'value': '1' }, { 'label': 'Auto', 'value': '0' }, { 'label': 'Light', 'value': '2' }]} />
            </Collapse>
            <Collapse icon={<Network />} title="Low Quality Mode">
                <Text mb={2}>With low quality mode enabled, Ossia will download songs and thumbnails in the lowest quality possible. This feature is recommended if your&apos;e using mobile data.</Text>
                <Text>Auto: Ossia will try to detect when it&apos;s running on mobile data and set the mode accordingly.</Text>
                <SegmentedControl value={lowQualityMode.toString()} onChange={(val: any) => { setLowQualityMode(Number(val)) }} data={[{ 'label': 'Off', 'value': '0' }, { 'label': 'Auto', 'value': '1' }, { 'label': 'On', 'value': '2' }]} />
            </Collapse>
            <Text size="lg" mt='md'>Advanced</Text>
            <Collapse icon={<Database />} title="Local Storage Inspector Tool">
                <Text>Warning: Editing local storage can break the app, don&apos;t use this if you&apos;re not sure what you&apos;re doing!</Text>
                <LSInspect />
            </Collapse>
        </Group>
    </Container>)
}

export default Settings