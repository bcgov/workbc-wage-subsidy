import React, { ReactNode } from "react"
import { RaRecord, useRecordContext } from "react-admin"
import { ResponsiveStyleValue, SxProps } from "@mui/system"

export const ApplicationShow = (props: CustomShowProps) => {
    const record = useRecordContext(props)
    console.log(record)
    return (
        <a>{record?.internalid}</a>
        // <div style={{ position: "relative", height: "700px", marginTop: 10 }}>
        //     <div
        //         style={{ backgroundColor: "white", width: "100%", height: "58px", position: "absolute", zIndex: 1 }}
        //     >
        //         &nbsp;
        //     </div>
        //     <iframe
        //         id="support-form"
        //         src="https://forms-dev.es.workbc.ca/app/form/submit?f=47794263-67fd-490e-b6ad-c26313b2563a"
        //         style={{ width: "100%", height: "700px" }}
        //     ></iframe>
        // </div>
    )
}

interface CustomShowProps {
    children: ReactNode
    className?: string
    divider?: ReactNode
    record?: RaRecord
    spacing?: ResponsiveStyleValue<number | string>
    sx?: SxProps
}
