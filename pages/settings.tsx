import { Accordion, AccordionItem, Text, Button, SegmentedControl, JsonInput, Modal, TextInput, Textarea, Breadcrumbs } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import type { NextPage } from 'next'
import { Adjustments, AntennaBars5, Braces, BrandLastfm, CalendarTime, Database, DatabaseExport, DatabaseImport, DatabaseOff, Link, User, X } from 'tabler-icons-react';
import lzstring from 'lz-string'
import { useState } from 'react';

const Settings: NextPage = () => {
    const modals = useModals();
    const [exportModal, setExportModal] = useState(false)
    const [importModal, setImportModal] = useState(false)
    const [exportVal, setExportVal] = useState('')
    const [lqmode, setLQMode] = useLocalStorage({
        'key': 'lowQualityMode',
        'defaultValue': 1
    })

    const comingSoon = () => {
        showNotification({
            title: 'Feature coming soon...', message: '', icon: <CalendarTime />,
        })
    }

    const userData = ["history", "liked-songs", "lowQualityMode", "loop"]

    const importLocalStorage = () => {
        setImportModal(true)
    }

    const ilsModalAction = () => {
        const input = document?.querySelector("#importInput")! as HTMLInputElement
        if (!input.value) { return }
        const json = JSON.parse(lzstring.decompressFromBase64(input.value)!)
        for (const item in json) {
            localStorage.setItem(item, json[item])
        }
        showNotification({
            'title': "Successful import",
            'icon': <DatabaseImport />,
            'message': '',
        })
        setImportModal(false)
    }

    const exportLocalStorage = () => {
        if (exportVal) { setExportModal(true); return }
        let exported: any = {}
        for (const item of userData) {
            exported[item] = localStorage.getItem(item)
        }
        setExportVal(lzstring.compressToBase64(JSON.stringify(exported)))
        setExportModal(true)
    }

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

    const clearLocalStorage = () => {
        const action = () => {
            if (typeof window !== 'undefined') {
                for (const item of userData) {
                    localStorage.removeItem(item)
                }
                showNotification({
                    title: 'User data cleared',
                    message: '',
                    icon: <X />,
                })
            }
        }
        confirm(action)
    }

    const LSDisp = () => {
        if (typeof window === 'undefined') { return <></> }
        let i = 0
        return (<Accordion>
            {Object.keys(localStorage).map((item: any) => {
                i++
                return (
                    <AccordionItem label={item} key={i}>
                        <JsonInput
                            label={item}
                            validationError=""
                            autosize
                            formatOnBlur
                            value={localStorage[item]}
                            minRows={3}
                        />
                    </AccordionItem>
                )
            })}
        </Accordion>)
    }

    return (
        <>
            <Modal
                opened={exportModal}
                onClose={() => { setExportModal(false) }}
                title="Export code"
            >
                <Text mb='sm'>Paste this code to the other device&apos;s import code field.</Text>
                <Textarea maxRows={5} onClick={(e: any) => {
                    e.target.select()
                }} autosize value={exportVal} />
            </Modal>
            <Modal
                opened={importModal}
                onClose={() => { setImportModal(false) }}
                title="Import code"
            >
                <Text mb='sm'>Enter the code you generated on the previous device.</Text>
                <Textarea mb='sm' onSubmit={ilsModalAction} id='importInput' />
                <Button onClick={ilsModalAction}>Submit</Button>
            </Modal>
            <Accordion>
                <AccordionItem icon={<Database />} label="User Data">
                    <Accordion>
                        <AccordionItem icon={<DatabaseOff />} label="Clear User Data">
                            <Text mb='sm'>Ossia stores liked songs, recents etc. in the browser&apos;s local storage. If you wish to clear this data, press the button.</Text>
                            <Button onClick={clearLocalStorage}>Clear data</Button>
                        </AccordionItem>
                        <AccordionItem icon={<DatabaseImport />} label="Import User Data">
                            <Text mb='sm'>Ossia stores liked songs, recents etc. in the browser&apos;s local storage. If you wish to import this data from another device, press the button.</Text>
                            <Button onClick={importLocalStorage}>Import data</Button>
                        </AccordionItem>
                        <AccordionItem icon={<DatabaseExport />} label="Export User Data">
                            <Text mb='sm'>Ossia stores liked songs, recents etc. in the browser&apos;s local storage. If you wish to export this data to another device, press the button.</Text>
                            <Button onClick={exportLocalStorage}>Export data</Button>
                        </AccordionItem>
                    </Accordion>
                </AccordionItem>
                <AccordionItem icon={<Adjustments />} label="Behaviour">
                    <Accordion>
                        <AccordionItem icon={<AntennaBars5 />} label="Low quality mode">
                            <Text mb={2}>With low quality mode enabled, Ossia will download songs and thumbnails in the lowest quality possible. This feature is recommended if you&apos;re using mobile data.</Text>
                            <Text mb='sm'>Auto: Ossia will try to detect when it&apos;s running on mobile data and set the mode accordingly.</Text>
                            <SegmentedControl onChange={(val) => { setLQMode(Number(val)) }} value={lqmode.toString()} data={[{ 'label': 'Off', 'value': '0' }, { 'label': 'Auto', 'value': '1' }, { 'label': 'On', 'value': '2' }]} />
                        </AccordionItem>
                    </Accordion>
                </AccordionItem>
                <AccordionItem icon={<Link />} label="Connections">
                    <Accordion>
                        <AccordionItem icon={<BrandLastfm />} label="Link Last.fm account">
                            <Text mb='sm'>Scrobble your songs with Ossia.</Text>
                            <Button className='nodim' component='a' href={`${location?.origin}/login`} target="_blank" leftIcon={<User />}>Sign in</Button>
                        </AccordionItem>
                    </Accordion>
                </AccordionItem>
                <AccordionItem icon={<Braces />} label="Advanced">
                    <Accordion>
                        <AccordionItem icon={<Database />} label="Display all data from local storage">
                            <LSDisp />
                        </AccordionItem>
                    </Accordion>
                </AccordionItem>
            </Accordion>
        </>
    )
}

export default Settings