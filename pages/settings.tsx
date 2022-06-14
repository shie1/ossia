import { Accordion, AccordionItem, Text, Button, SegmentedControl, JsonInput } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import type { NextPage } from 'next'
import { Adjustments, AntennaBars5, Braces, CalendarTime, Database, DatabaseExport, DatabaseImport, DatabaseOff, X } from 'tabler-icons-react';

const Settings: NextPage = () => {
    const modals = useModals();
    const [lqmode, setLQMode] = useLocalStorage({
        'key': 'lowQualityMode',
        'defaultValue': 1
    })

    const comingSoon = () => {
        showNotification({
            title: 'Feature coming soon...', message: '', icon: <CalendarTime />,
        })
    }

    const importLocalStorage = comingSoon

    const exportLocalStorage = comingSoon

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
                localStorage.clear()
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
            <Accordion>
                <AccordionItem icon={<Database />} label="User Data">
                    <Accordion>
                        <AccordionItem icon={<DatabaseOff />} label="Clear User Data">
                            <Text mb='sm'>Ossia stores liked songs, recents etc. in the browsers local storage. If you wish to clear this data, press the button.</Text>
                            <Button onClick={clearLocalStorage}>Clear data</Button>
                        </AccordionItem>
                        <AccordionItem icon={<DatabaseImport />} label="Import User Data">
                            <Text mb='sm'>Ossia stores liked songs, recents etc. in the browsers local storage. If you wish to import this data from another device, press the button.</Text>
                            <Button onClick={importLocalStorage}>Import data</Button>
                        </AccordionItem>
                        <AccordionItem icon={<DatabaseExport />} label="Export User Data">
                            <Text mb='sm'>Ossia stores liked songs, recents etc. in the browsers local storage. If you wish to export this data to another device, press the button.</Text>
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
                <AccordionItem icon={<Braces />} label="Advanced">
                    <Accordion>
                        <AccordionItem icon={<DatabaseExport />} label="Display all data from local storage">
                            <LSDisp />
                        </AccordionItem>
                    </Accordion>
                </AccordionItem>
            </Accordion>
        </>
    )
}

export default Settings