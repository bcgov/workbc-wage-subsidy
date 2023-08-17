import { Box, Chip } from "@mui/material"
import { FunctionField, List, TextField, useStore, Identifier } from "react-admin"
import { FormBulkActionButtons } from "../common/components/FormBulkActionButtons/FormBulkActionButtons"
import { ListActions } from "../common/components/ListActions/ListActions"
import { DatagridStyles } from "../common/styles/DatagridStyles"
import { ClaimListAside } from "./ClaimListAside"
import CustomDatagrid from "../common/components/CustomDatagrid/CustomDatagrid"

export const claimStatusFilters = {
    All: { label: "All" },
    NotSubmitted: { label: "Draft", status: ["Draft"] },
    Submitted: { label: "Submitted", status: ["Submitted", "Processing", "Completed"] },
    Cancelled: { label: "Cancelled", status: ["Cancelled"] }
} as { [key: string]: any }

export const ClaimList = (props: any) => {
    const [statusFilter] = useStore("resources.claims.list.statusFilter", claimStatusFilters.All)

    const handleRowClick = (id: Identifier, resource: string, record: any) => {
        // Temporary click functionality (opens form in a new tab) (will get replaced by embed functionality eventually)
        if (record.status === "Submitted") {
            // submitted
            window.open(`${process.env.REACT_APP_VIEW_URL}${record.form_submission_id}`)
        } else if (record.status === "Draft" && record.form_submission_id) {
            // saved
            window.open(`${process.env.REACT_APP_DRAFT_URL}${record.form_submission_id}`)
        } else {
            window.open(`${process.env.REACT_APP_CLAIM_URL}&token=${id}`)
        }
        return "" // rowClick expects a path to be returned
    }

    return (
        <>
            <Box id="main-content-custom" tabIndex={0} aria-label="main content">
                <List
                    {...props}
                    actions={<ListActions createButtonLabel="New Claim Form" />}
                    filter={statusFilter}
                    filterDefaultValues={{ dummyUserFilter: -1 }} // TODO: filter by current user.
                    aside={<ClaimListAside />}
                >
                    <CustomDatagrid
                        bulkActionButtons={<FormBulkActionButtons />}
                        sx={DatagridStyles}
                        rowClick={handleRowClick}
                        ariaLabel="claims list"
                    >
                        <TextField label="Submission ID" source="form_confirmation_id" emptyText="-" />
                        <TextField label="Position Title" source="position_title" emptyText="-" />
                        <FunctionField
                            label="Employee Name"
                            render={(record: any) =>
                                record.employee_first_name || record.employee_last_name
                                    ? `${record.employee_first_name ?? ""} ${record.employee_last_name ?? ""}`
                                    : "-"
                            }
                        />
                        <FunctionField
                            label="Submitted Date"
                            render={
                                (record: any) =>
                                    record.form_submitted_date ? record.form_submitted_date.split("T")[0] : "-" // remove timestamp
                            }
                        />
                        <TextField label="Shared With" source="shared_with" emptyText="-" /> {/* TODO */}
                        <TextField label="Associated Application ID" source="associated_application_id" emptyText="-" />
                        <FunctionField
                            label=""
                            render={(record: any) => (
                                <Box display="flex" width="100%" justifyContent="center">
                                    <Chip
                                        label={
                                            record.status === "Submitted" ||
                                            record.status === "Processing" ||
                                            record.status === "Completed"
                                                ? "Submitted"
                                                : record.status
                                        }
                                        size="small"
                                        color={
                                            record.status === "Submitted" ||
                                            record.status === "Processing" ||
                                            record.status === "Completed"
                                                ? "primary"
                                                : record.status === "Cancelled"
                                                ? "error"
                                                : "info"
                                        }
                                    />
                                </Box>
                            )}
                        />
                    </CustomDatagrid>
                </List>
            </Box>
        </>
    )
}
