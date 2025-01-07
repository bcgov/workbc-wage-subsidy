import { Button } from "@mui/material"
import { useDataProvider } from "react-admin"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilePdf } from "@fortawesome/pro-solid-svg-icons"
import { COLOURS } from "../../../Colours"
import { downloadPdf } from "../../../utils/FileFunctions"
import { useMutation } from "react-query"

interface PDFButtonFieldProps {
    record: any
    resource: any
}

const PdfButtonField: React.FC<PDFButtonFieldProps> = ({ record, resource }) => {
    const dataProvider = useDataProvider()
    const { mutate: getPdf } = useMutation((formType) => {
        return dataProvider
            .getPdf(resource, {
                id: record?.id,
                formType: formType
            })
            .then(({ result }) => {
                const filename =
                    (resource === "applications" ? "application_" : "claim_") + record?.form_confirmation_id + ".pdf"
                downloadPdf(result, filename)
            })
    })

    return (
        <Button
            onClick={(event) => {
                event?.stopPropagation()
                let formType
                if (resource === "applications" && record?.form_type) {
                    // Remove spaces from form type string.
                    formType = record.form_type.replace(/\s/g, "")
                } else if (resource === "claims") {
                    formType = "ServiceProviderClaimForm"
                }
                if (record?.id && record?.form_confirmation_id && formType) {
                    getPdf(formType)
                }
            }}
            sx={{ minWidth: "3em", padding: "0.6em" }}
            aria-label="Generate PDF"
        >
            <FontAwesomeIcon icon={faFilePdf} size="xl" style={{ color: COLOURS.LIGHTBLUE_TEXT }} />
        </Button>
    )
}

export default PdfButtonField
