import { Box, Chip } from "@mui/material"
import { FunctionField, Identifier, List, TextField, useRedirect, useUnselectAll } from "react-admin"
import { useContext, useEffect, useState } from "react"
import CatchmentLabel from "../common/components/CatchmentLabel/CatchmentLabel"
import { CatchmentContext } from "../common/contexts/CatchmentContext/CatchmentContext"
import CustomDatagrid from "../common/components/CustomDatagrid/CustomDatagrid"
import { ListActions } from "../common/components/ListActions/ListActions"
import { ListAside } from "../common/components/ListAside/ListAside"

export const claimStatusFilters = {
    All: { label: "All" },
    New: { label: "New", status: "New" },
    InProgress: { label: "In Progress", status: "In Progress" },
    Completed: { label: "Completed", status: "Completed" },
    Cancelled: { label: "Cancelled", status: "Cancelled" }
} as { [key: string]: any }

export const ClaimList = (props: any) => {
    const cc = useContext(CatchmentContext)
    const unselectAll = useUnselectAll("claims")
    const [statusFilter, setStatusFilter] = useState(claimStatusFilters["All"])
    const redirect = useRedirect()

    useEffect(() => {
        unselectAll()
    }, [cc.catchment])

    const handleRowClick = (id: Identifier, resource: string, record: any) => {
        if (record.status === "New" && record.service_provider_form_submission_id) {
            redirect("/ViewForm/Draft/claims/" + record.service_provider_form_submission_id + "/" + record.id, "")
        } else if (record.service_provider_form_submission_id) {
            redirect("/ViewForm/View/claims/" + record.service_provider_form_submission_id + "/" + record.id, "")
        } else {
            return "" // rowClick expects a path to be returned
        }
    }

    return (
        <>
            {cc.catchments.length > 0 && cc.catchment.id > 0 && (
                <Box id="main-content-custom" tabIndex={0} aria-label="main content">
                    <CatchmentLabel catchment={cc.catchment.name} />
                    <List
                        {...props}
                        actions={<ListActions />}
                        filter={{ ...statusFilter, catchmentno: cc.catchment.id }}
                        filterDefaultValues={{ ...statusFilter, catchmentno: cc.catchment.id }}
                        aside={
                            <ListAside
                                statusFilters={claimStatusFilters}
                                statusFilter={statusFilter}
                                setStatusFilter={setStatusFilter}
                            />
                        }
                    >
                        <CustomDatagrid showCalculatorButton={true} rowClick={handleRowClick} ariaLabel="claims list">
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
                            <TextField
                                label="Associated Application ID"
                                source="associated_application_id"
                                emptyText="-"
                            />
                            <FunctionField
                                label=""
                                render={(record: any) => (
                                    <Box display="flex" width="100%" justifyContent="center">
                                        <Chip
                                            label={
                                                record.status === "In Progress"
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
                                                    ? "secondary"
                                                    : record.status === "New"
                                                    ? "info"
                                                    : record.status === "In Progress"
                                                    ? "warning"
                                                    : record.status === "Completed"
                                                    ? "success"
                                                    : record.status === "Cancelled"
                                                    ? "error"
                                                    : "primary"
                                            }
                                        />
                                    </Box>
                                )}
                            />
                        </CustomDatagrid>
                    </List>
                </Box>
            )}
        </>
    )
}
