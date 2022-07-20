export const hashArray = (array: Array<any>) => {
    return array.map(item => JSON.stringify(item)).join(",")
}

export const hashKeys = (object: any) => {
    return hashArray(Object.keys(object))
}