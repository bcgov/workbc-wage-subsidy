import { Button } from "@mui/material"
import { useRecordContext } from "react-admin"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalculator } from "@fortawesome/pro-solid-svg-icons"
import { COLOURS } from "../../../Colours"

const CalculatorButtonField: React.FC = () => {
    const record = useRecordContext()

    return record.status === "Processing" ? (
        <Button
            onClick={(event) => {
                event?.stopPropagation()
                // TODO: navigate to calculator
            }}
            sx={{ minWidth: "2.5em" }}
            aria-label="Open calculator"
        >
            <FontAwesomeIcon icon={faCalculator} size="xl" style={{ color: COLOURS.LIGHTBLUE_TEXT }} />
        </Button>
    ) : (
        <span />
    )
}

export default CalculatorButtonField
