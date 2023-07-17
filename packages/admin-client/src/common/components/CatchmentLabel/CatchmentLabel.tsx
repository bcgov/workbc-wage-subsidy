import { Box } from "@mui/material"
import "./CatchmentLabel.css"

interface CatchmentLabelProps {
    catchment: string
}

const CatchmentLabel: React.FC<CatchmentLabelProps> = ({ catchment }) => (
    <Box style={{ transform: "translate(13em, 3em)" }}>
        <span className="catchment-label">{catchment}</span>
    </Box>
)

export default CatchmentLabel
