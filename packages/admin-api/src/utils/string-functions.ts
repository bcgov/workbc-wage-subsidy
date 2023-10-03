export const formatDateMmmDDYYYY = (value: string) => (value ? new Date(value).toDateString().substring(4) : "")

export const formatDateTime = (value: string) => {
    if (value) {
        const date = formatDateMmmDDYYYY(value)
        const time12hr = new Date(value).toLocaleTimeString("en-US", { hour12: true })
        return `${date} ${time12hr}`
    }
    return ""
}

export const formatCurrency = (value: string) => {
    if (value) {
        const toTwoDecimals = Number(value).toFixed(2)
        return `$${toTwoDecimals}`
    }
    return ""
}

export const formatPercentage = (value: string) => (value ? `${value}%` : "")
