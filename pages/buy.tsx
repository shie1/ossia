import type { NextPage } from "next";

const Buy: NextPage = (props: any) => {
    return (<>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src={`https://www.paypal.com/sdk/js?client-id=${props["PAYPAL_ID"]}&currency=USD`} />
    </>)
}

export function getServerSideProps() {
    require('dotenv').config()
    return { props: { PAYPAL_ID: process.env["PAYPAL_ID"] } }
}

export default Buy