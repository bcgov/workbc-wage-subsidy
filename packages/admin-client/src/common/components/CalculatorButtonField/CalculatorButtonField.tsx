import { Button } from "@mui/material"
import { FunctionField } from "react-admin"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalculator } from "@fortawesome/pro-solid-svg-icons"
import { COLOURS } from "../../../Colours"

const CalculatorButtonField: React.FC = () => {
    return (
        <FunctionField
            label=""
            render={(record: any) =>
                record.status === "Processing" && (
                    <Button
                        onClick={(event) => {
                            event?.stopPropagation()
                            // console.log(record)
                            console.log("calculator button")
                        }}
                        sx={{ minWidth: "2.5em" }}
                    >
                        <FontAwesomeIcon icon={faCalculator} size="xl" style={{ color: COLOURS.LIGHTBLUE_TEXT }} />
                    </Button>
                )
            }
        />
    )
}

export default CalculatorButtonField
