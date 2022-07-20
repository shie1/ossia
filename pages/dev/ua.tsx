import { Textarea } from "@mantine/core";
import type { NextPage } from "next";

const CopyUserAgent: NextPage = (props: any) => {
    return (<>
        <Textarea autosize value={JSON.stringify(props.userAgent,null,4)} />
    </>)
}

export default CopyUserAgent