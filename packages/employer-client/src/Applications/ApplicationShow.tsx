import { ReactNode } from "react"
import { RaRecord } from "react-admin"
import { ResponsiveStyleValue, SxProps } from "@mui/system"

export const ApplicationShow = (props: CustomShowProps) => <></>

interface CustomShowProps {
    children: ReactNode
    className?: string
    divider?: ReactNode
    record?: RaRecord
    spacing?: ResponsiveStyleValue<number | string>
    sx?: SxProps
}
