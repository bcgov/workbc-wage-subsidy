import { Box } from "@mui/material"
import "./CatchmentLabel.css"
import React from "react"
import { ScreenReaderOnly } from "../../styles/ScreenReaderOnly"

interface CatchmentLabelProps {
    catchment: string
}

const CatchmentLabel: React.FC<CatchmentLabelProps> = ({ catchment }) => (
    <Box width="30em" style={{ transform: "translate(13em, 3em)" }}>
        <span style={ScreenReaderOnly}>{"Catchment " + catchment}</span>
        <span className="catchment-label" aria-hidden={true}>
            {catchment}
        </span>
    </Box>
)

export default CatchmentLabel
