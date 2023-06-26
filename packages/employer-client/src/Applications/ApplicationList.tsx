import { useStore, Datagrid, FunctionField, List, TextField, Identifier } from "react-admin"
import { Box, Chip } from "@mui/material"
import { ApplicationListAside } from "./ApplicationListAside"
import { ApplicationCreateRedirect } from "./ApplicationCreateRedirect"
import { FormBulkActionButtons } from "../common/components/FormBulkActionButtons/FormBulkActionButtons"
import { DatagridStyles } from "../common/styles/DatagridStyles"
import { ListActions } from "../common/components/ListActions/ListActions"

export const applicationStatusFilters = {
    All: { label: "All" },
    NotSubmitted: { label: "Draft", status: "Draft" },
    Submitted: { label: "Submitted", status: "Submitted" },
    Processing: { label: "Processing", status: "Processing" },
    Completed: { label: "Completed", status: "Completed" },
    Cancelled: { label: "Cancelled", status: "Cancelled" }
} as { [key: string]: any }

export const ApplicationList = (props: any) => {
    const [statusFilter] = useStore("resources.applications.list.statusFilter", applicationStatusFilters.All)

    return (
        <List
            {...props}
            actions={<ListActions createButtonLabel="New Application" />}
            filter={statusFilter}
            filters={[]}
            aside={<ApplicationListAside />}
            empty={<ApplicationCreateRedirect />}
        >
            <Datagrid
                bulkActionButtons={<FormBulkActionButtons />}
                sx={DatagridStyles}
                rowClick={(id: Identifier, resource: string, record: any) => {
                    // Temporary click functionality (opens form in a new tab) (will get replaced by embed functionality eventually)
                    if (record.status === "Submitted") {
                        // submitted
                        window.open(`${process.env.REACT_APP_VIEW_URL}${record.form_submission_id}`)
                    } else if (record.status === "Draft" && record.form_submission_id) {
                        // saved
                        window.open(`${process.env.REACT_APP_DRAFT_URL}${record.form_submission_id}`)
                    } else {
                        // new
                        if (record.form_type === "Have Employee")
                            window.open(`${process.env.REACT_APP_HAVE_EMPLOYEE_URL}&token=${id}`)
                        else if (record.form_type === "Need Employee")
                            window.open(`${process.env.REACT_APP_NEED_EMPLOYEE_URL}&token=${id}`)
                    }
                    return "" // rowClick expects a path to be returned
                }}
            >
                <TextField label="Submission ID" source="form_confirmation_id" emptyText="-" />
                <TextField label="Position Title" source="position_title" emptyText="-" />
                <TextField label="Number of Positions" source="num_positions" emptyText="-" />{" "}
                <FunctionField
                    label="Submitted Date"
                    render={
                        (record: any) => (record.form_submitted_date ? record.form_submitted_date.split("T")[0] : "-") // remove timestamp
                    }
                />
                <TextField label="Shared With" source="shared_with" emptyText="-" />
                <FunctionField
                    label=""
                    render={(record: any) => (
                        <Box display="flex" width="100%" justifyContent="center">
                            <Chip
                                label={record.status}
                                size="small"
                                color={
                                    record.status === "Draft"
                                        ? "info"
                                        : record.status === "Submitted"
                                        ? "primary"
                                        : record.status === "Processing"
                                        ? "warning"
                                        : record.status === "Completed"
                                        ? "success"
                                        : record.status === "Cancelled"
                                        ? "error"
                                        : "info"
                                }
                            />
                        </Box>
                    )}
                />
            </Datagrid>
        </List>
    )
}
