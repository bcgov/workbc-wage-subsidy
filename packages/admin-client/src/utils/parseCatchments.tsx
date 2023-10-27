const toTitleCase = (str: string) => {
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

export const parseCatchments = (permissions: any[]) => {
    // Extract catchment number and location. Remove leading '1'.
    // Remove null and non-numeric catchment numbers.
    // Sort in ascending order.
    return permissions
        .map((item: any) => {
            return {
                catchmentNo: Number(item.Catchment.slice(1)),
                location: toTitleCase(item.CatchmentDescription)
            }
        })
        .filter((item: any) => item.catchmentNo != null && !Number.isNaN(item.catchmentNo))
        .sort((item1: any, item2: any) => item1.catchmentNo - item2.catchmentNo)
}
