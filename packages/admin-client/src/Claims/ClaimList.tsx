import { Box, Chip } from "@mui/material"
import { FunctionField, Identifier, List, TextField, useUnselectAll } from "react-admin"
import { DatagridStyles } from "../common/styles/DatagridStyles"
import { useContext, useEffect } from "react"
import CatchmentLabel from "../common/components/CatchmentLabel/CatchmentLabel"
import { CatchmentContext } from "../common/contexts/CatchmentContext/CatchmentContext"
import CustomDatagrid from "../common/components/CustomDatagrid/CustomDatagrid"
import { FormBulkActionButtons } from "../common/components/FormBulkActionButtons/FormBulkActionButtons"
import { ListActions } from "../common/components/ListActions/ListActions"
import { ListAside } from "../common/components/ListAside/ListAside"

export const claimStatusFilters = {
    All: { label: "All" },
    New: { label: "New", status: "Submitted" },
    InProgress: { label: "In Progress", status: "Processing" },
    Completed: { label: "Completed", status: "Completed" },
    Cancelled: { label: "Cancelled", status: "Cancelled" }
} as { [key: string]: any }

export const ClaimList = (props: any) => {
    const cc = useContext(CatchmentContext)
    const unselectAll = useUnselectAll("claims")

    useEffect(() => {
        unselectAll()
    }, [cc.catchment])

    const handleRowClick = (id: Identifier, resource: string, record: any) => {
        console.log("row click")
        return ""

        // // Temporary click functionality (opens form in a new tab) (will get replaced by embed functionality eventually)
        // if (record.status === "Submitted") {
        //     // submitted
        //     window.open(`${process.env.REACT_APP_VIEW_URL}${record.form_submission_id}`)
        // } else if (record.status === "Draft" && record.form_submission_id) {
        //     // saved
        //     window.open(`${process.env.REACT_APP_DRAFT_URL}${record.form_submission_id}`)
        // } else {
        //     // new
        //     if (record.form_type === "Have Employee")
        //         window.open(`${process.env.REACT_APP_HAVE_EMPLOYEE_URL}&token=${id}`)
        //     else if (record.form_type === "Need Employee")
        //         window.open(`${process.env.REACT_APP_NEED_EMPLOYEE_URL}&token=${id}`)
        // }
        // return "" // rowClick expects a path to be returned
    }

    return (
        <>
            <CatchmentLabel catchment={cc.catchment.name} />
            <List
                {...props}
                actions={<ListActions />}
                filter={{ ...claimStatusFilters["All"], catchmentno: cc.catchment.id }}
                filterDefaultValues={{ catchmentno: cc.catchment.id }}
                aside={<ListAside statusFilters={claimStatusFilters} />}
            >
                <CustomDatagrid
                    bulkActionButtons={<FormBulkActionButtons />}
                    showCalculatorButton={true}
                    sx={DatagridStyles}
                    rowClick={handleRowClick}
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
                    <TextField label="Associated Application ID" source="associated_application_id" emptyText="-" />
                    <FunctionField
                        label=""
                        render={(record: any) => (
                            <Box display="flex" width="100%" justifyContent="center">
                                <Chip
                                    label={
                                        record.status === "Processing"
                                            ? "In Progress"
                                            : record.status === "Completed"
                                            ? "Completed"
                                            : record.status === "Cancelled"
                                            ? "Cancelled"
                                            : "New"
                                    }
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
                </CustomDatagrid>
            </List>
        </>
    )
}
