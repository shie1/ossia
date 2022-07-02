import lzString from "lz-string"

export const useCompressedLocalStorage = () => {
    function setItem(key:any,value:any){
        if(typeof window === 'undefined'){return}
        localStorage.setItem(key,lzString.compressToBase64(JSON.stringify(value)))
    }
    function getItem(key:any){
        if(typeof window === 'undefined'){return}
        return JSON.parse(lzString.decompressFromBase64(localStorage.getItem(key)!)!)
    }
    return {'setItem': setItem, 'getItem': getItem}
}