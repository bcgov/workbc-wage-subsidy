import { Button } from "@mui/material"
import { useRecordContext, useRedirect } from "react-admin"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalculator } from "@fortawesome/pro-solid-svg-icons"
import { COLOURS } from "../../../Colours"

const CalculatorButtonField: React.FC = () => {
    const record = useRecordContext()
    const redirect = useRedirect()

    return record.status === "In Progress" ? (
        <Button
            onClick={(event) => {
                event?.stopPropagation()
                redirect(`/ViewForm/claims/${record.id}`, "", "", {}, { initialTab: "calculator" })
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
