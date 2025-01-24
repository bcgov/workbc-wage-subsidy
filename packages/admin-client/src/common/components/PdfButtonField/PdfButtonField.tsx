import { Button } from "@mui/material"
import { useDataProvider } from "react-admin"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilePdf } from "@fortawesome/pro-solid-svg-icons"
import { COLOURS } from "../../../Colours"
import { downloadPdf } from "../../../utils/FileFunctions"
import { useMutation } from "react-query"
import moment from "moment"
interface PDFButtonFieldProps {
    record: any
    resource: any
}

const PdfButtonField: React.FC<PDFButtonFieldProps> = ({ record, resource }) => {
    const dataProvider = useDataProvider()
    const { mutate: getPdf } = useMutation((formType) => {
        try {
            if (!record) {
                console.error("Record not found")
                throw new Error("Record not found")
            }
            return dataProvider
                .getPdf(resource, {
                    id: record.id,
                    formType: formType
                })
                .then(async ({ result }) => {
                    if (resource === "claims") {
                        const { employerInfo } = await dataProvider.getEmployerInfo("employer", { id: record.id })
                        if (!employerInfo) {
                            console.error("Employer info not found, cannot generate PDF")
                            throw new Error("Employer info not found, cannot generate PDF")
                        }
                        const claimPeriodStartString = employerInfo["periodStart"]
                        const claimPeriodEndString = employerInfo["periodEnd"]
                        const formattedPeriodStart = moment(claimPeriodStartString).format("MMM D")
                        const formattedPeriodEnd = moment(claimPeriodEndString).format("MMM D YYYY")
                        const clientInitials = record.employee_first_name[0] + record.employee_last_name[0]
                        const claimsFileName = (
                            "WS_Claim" +
                            "_" +
                            employerInfo["employerName"] +
                            "_" +
                            formattedPeriodStart +
                            "-" +
                            formattedPeriodEnd +
                            "_" +
                            clientInitials +
                            "_" +
                            record.form_confirmation_id +
                            ".pdf"
                        ).replace(/ /g, "_")
                        downloadPdf(result, claimsFileName)
                    } else {
                        const dateString = record.form_submitted_date
                        const formattedDate = moment(dateString).format("MMM D YYYY")
                        const applicationsFileName = (
                            record.form_confirmation_id +
                            "_" +
                            record.organization +
                            "_" +
                            formattedDate +
                            ".pdf"
                        ).replace(/ /g, "_")
                        downloadPdf(result, applicationsFileName)
                    }
                })
        } catch (error) {
            console.error("Error getting PDF: ", error)
            throw new Error("Error getting PDF")
        }
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
                if (record && record.id && record.form_confirmation_id && formType) {
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
