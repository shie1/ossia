import type { NextPage } from "next";
import { useEffect } from "react";

const CopyUserAgent: NextPage = (props: any) => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.navigator.clipboard.writeText(JSON.stringify(props.userAgent))
        }
    }, [props.userAgent])
    return (<></>)
}

export default CopyUserAgent