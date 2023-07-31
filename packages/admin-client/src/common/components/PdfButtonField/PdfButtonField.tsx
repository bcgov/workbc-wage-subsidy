import { Button } from "@mui/material"
import { FunctionField } from "react-admin"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilePdf } from "@fortawesome/pro-solid-svg-icons"
import { COLOURS } from "../../../Colours"

const PdfButtonField: React.FC = () => {
    return (
        <FunctionField
            label=""
            render={(record: any) => (
                <Button
                    onClick={(event) => {
                        event?.stopPropagation()
                        // console.log(record)
                        console.log("pdf button")
                    }}
                    sx={{ minWidth: "3em" }}
                >
                    <FontAwesomeIcon icon={faFilePdf} size="xl" style={{ color: COLOURS.LIGHTBLUE_TEXT }} />
                </Button>
            )}
        />
    )
}

export default PdfButtonField
