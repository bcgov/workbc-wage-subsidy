import React, { ReactNode } from "react"
import { RaRecord, useRecordContext } from "react-admin"
import { ResponsiveStyleValue, SxProps } from "@mui/system"

export const ApplicationShow = (props: CustomShowProps) => {
    const record = useRecordContext(props)
    console.log(record)
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
