import { ResponsiveStyleValue, SxProps } from "@mui/system"
import { ReactNode } from "react"
import { RaRecord, useRecordContext } from "react-admin"

export const ClaimShow = (props: CustomShowProps) => {
    const record = useRecordContext(props)
    return <a>{record?.internalid}</a>
}

interface CustomShowProps {
    children: ReactNode
    className?: string
    divider?: ReactNode
    record?: RaRecord
    spacing?: ResponsiveStyleValue<number | string>
    sx?: SxProps
}
