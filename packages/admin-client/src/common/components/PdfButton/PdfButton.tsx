import { Button } from "@mui/material"
import { FunctionField } from "react-admin"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilePdf } from "@fortawesome/pro-solid-svg-icons"
import { COLOURS } from "../../../Colours"

const PdfButton: React.FC = () => {
    return (
        <FunctionField
            label=""
            render={(record: any) => (
                <Button
                    onClick={(event) => {
                        // Prevent rowClick() from also triggering.
                        event?.stopPropagation()
                        console.log(record)
                    }}
                >
                    <FontAwesomeIcon icon={faFilePdf} size="xl" style={{ color: COLOURS.LIGHTBLUE_TEXT }} />
                </Button>
            )}
        />
    )
}

export default PdfButton
