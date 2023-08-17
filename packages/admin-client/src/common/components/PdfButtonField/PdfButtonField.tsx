import { Button } from "@mui/material"
import { useRecordContext } from "react-admin"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilePdf } from "@fortawesome/pro-solid-svg-icons"
import { COLOURS } from "../../../Colours"

const PdfButtonField: React.FC = () => {
    const record = useRecordContext()

    return (
        <Button
            onClick={(event) => {
                event?.stopPropagation()
                // TODO: implement PDF generation
            }}
            sx={{ minWidth: "3em" }}
            aria-label="Generate PDF"
        >
            <FontAwesomeIcon icon={faFilePdf} size="xl" style={{ color: COLOURS.LIGHTBLUE_TEXT }} />
        </Button>
    )
}

export default PdfButtonField
