import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Page404: NextPage = () => {
    const [redir, setRedir] = useState("") 
    useEffect(()=>{if(typeof window !== 'undefined'){setRedir(location.origin)}},[setRedir])
    return <meta httpEquiv="refresh" content={`0;URL='${redir}'`} />
}

export default Page404