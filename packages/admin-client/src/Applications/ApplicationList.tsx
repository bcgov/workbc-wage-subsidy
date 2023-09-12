import { Box, Chip, MenuItem, Select } from "@mui/material"
import { FunctionField, Identifier, List, TextField, useUnselectAll, useUpdate, useRefresh } from "react-admin"
import { useContext, useEffect, useState } from "react"
import CatchmentLabel from "../common/components/CatchmentLabel/CatchmentLabel"
import { CatchmentContext } from "../common/contexts/CatchmentContext/CatchmentContext"
import CustomDatagrid from "../common/components/CustomDatagrid/CustomDatagrid"
import { ListActions } from "../common/components/ListActions/ListActions"
import { ListAside } from "../common/components/ListAside/ListAside"

export const applicationStatusFilters = {
    All: { label: "All" },
    New: { label: "New", status: "New" },
    InProgress: { label: "In Progress", status: "In Progress" },
    Completed: { label: "Completed", status: "Completed" },
    Cancelled: { label: "Cancelled", status: "Cancelled" }
} as { [key: string]: any }

export const ApplicationList = (props: any) => {
    const cc = useContext(CatchmentContext)
    const unselectAll = useUnselectAll("applications")
    const [statusFilter, setStatusFilter] = useState(applicationStatusFilters["All"])
    const [update] = useUpdate()
    const refresh = useRefresh()

    useEffect(() => {
        unselectAll()
    }, [cc.catchment])

    const handleRowClick = (id: Identifier, resource: string, record: any) => {
        // Temporary click functionality (opens form in a new tab) (will get replaced by embed functionality eventually)
        window.open(`${process.env.REACT_APP_VIEW_URL}${record.form_submission_id}`)
        return "" // rowClick expects a path to be returned
    }

    const handleStatusChange = (record, newStatus) => {
        const diff = { status: newStatus }
        update(
            "applications",
            { id: record.id, data: diff, previousData: record },
            {
                onSuccess: () => {
                    refresh()
                }
            }
        )
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
                                statusFilters={applicationStatusFilters}
                                statusFilter={statusFilter}
                                setStatusFilter={setStatusFilter}
                            />
                        }
                    >
                        <CustomDatagrid rowClick={handleRowClick} ariaLabel="applications list">
                            <TextField label="Submission ID" source="form_confirmation_id" emptyText="-" />
                            <TextField label="Organization" source="created_by" emptyText="-" />
                            <TextField label="Position Title" source="position_title" emptyText="-" />
                            <FunctionField
                                label="Submitted Date"
                                render={
                                    (record: any) =>
                                        record.form_submitted_date ? record.form_submitted_date.split("T")[0] : "-" // remove timestamp
                                }
                            />
                            <TextField label="Form Type" source="form_type" emptyText="-" />
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
                                                    : record.status === "New"
                                                    ? "primary"
                                                    : record.status === "In Progress"
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
                            {/* TODO: move to embedded form page once created */}
                            <FunctionField
                                label="Set Status"
                                render={(record: any) => {
                                    const statuses = [
                                        { label: "New", status: "New" },
                                        { label: "In Progress", status: "In Progress" },
                                        { label: "Completed", status: "Completed" },
                                        { label: "Cancelled", status: "Cancelled" }
                                    ]
                                    return (
                                        <Box display="flex" width="100%" justifyContent="center">
                                            <Select
                                                value={record.status}
                                                onChange={(event) => handleStatusChange(record, event.target.value)}
                                                displayEmpty
                                                renderValue={() => record.status}
                                            >
                                                {statuses.map((status) => (
                                                    <MenuItem key={status.status} value={status.status}>
                                                        <span aria-hidden={true}>{status.label}</span>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                    )
                                }}
                            />
                        </CustomDatagrid>
                    </List>
                </Box>
            )}
        </>
    )
}
