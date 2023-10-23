import { Box, Chip } from "@mui/material"
import { useEffect, useState } from "react"
import { FunctionField, Identifier, List, TextField, useGetIdentity, useNotify, useRedirect } from "react-admin"
import CustomDatagrid from "../common/components/CustomDatagrid/CustomDatagrid"
import { FormBulkActionButtons } from "../common/components/FormBulkActionButtons/FormBulkActionButtons"
import { ListActions } from "../common/components/ListActions/ListActions"
import { ListAside } from "../common/components/ListAside/ListAside"
import { DatagridStyles } from "../common/styles/DatagridStyles"

export const applicationStatusFilters = {
    All: { label: "All" },
    NotSubmitted: { label: "Draft", status: ["Draft"] },
    Submitted: { label: "Submitted", status: ["New"] },
    Processing: { label: "Processing", status: ["In Progress"] },
    Completed: { label: "Completed", status: ["Completed"] },
    Cancelled: { label: "Cancelled", status: ["Cancelled"] }
} as { [key: string]: any }

export const ApplicationList = (props: any) => {
    const [statusFilter, setStatusFilter] = useState(applicationStatusFilters["All"])
    const { identity } = useGetIdentity()
    const redirect = useRedirect()
    const notify = useNotify()

    const handleRowClick = (id: Identifier, resource: string, record: any) => {
        if (record.status === "Draft" && record.form_submission_id) {
            redirect("/ViewForm/Draft/applications/" + record.form_submission_id, "")
        } else if (record.form_submission_id) {
            redirect("/ViewForm/View/applications/" + record.form_submission_id, "")
        } else {
            return "" // rowClick expects a path to be returned
        }
    }

    useEffect(() => {
        notify("Updating Applications...", { type: "info", autoHideDuration: 5000 })
        const update = async () => {
            setTimeout(() => {
                console.log("waiting")
                notify("Applications Updated.", { type: "success", autoHideDuration: 1000 })
            }, 5000)
        }
        update()
    }, [])

    return (
        <>
            {identity !== undefined && (
                <Box id="main-content-custom" tabIndex={0} aria-label="main content">
                    <List
                        {...props}
                        actions={<ListActions createButtonLabel="New Application" />}
                        filter={{ ...statusFilter, user: identity.guid }}
                        filterDefaultValues={{ ...statusFilter, user: identity.guid }}
                        aside={
                            <ListAside
                                statusFilters={applicationStatusFilters}
                                statusFilter={statusFilter}
                                setStatusFilter={setStatusFilter}
                                user={identity.guid}
                            />
                        }
                        sort={{
                            field: "form_submitted_date,updated_date,created_date",
                            order: "DESC,DESC,DESC"
                        }}
                    >
                        <CustomDatagrid
                            bulkActionButtons={<FormBulkActionButtons />}
                            sx={DatagridStyles}
                            rowClick={handleRowClick}
                            ariaLabel="applications list"
                        >
                            <TextField label="Submission ID" source="form_confirmation_id" emptyText="-" />
                            <TextField label="Position Title" source="position_title" emptyText="-" />
                            <TextField label="Number of Positions" source="num_positions" emptyText="-" />{" "}
                            <FunctionField
                                label="Submitted Date"
                                render={
                                    (record: any) =>
                                        record.form_submitted_date ? record.form_submitted_date.split("T")[0] : "-" // remove timestamp
                                }
                            />
                            <FunctionField
                                label="Shared With"
                                render={(record: any) => {
                                    const otherUsers = record["shared_with"].filter(
                                        (fullName) => fullName !== identity?.fullName
                                    )
                                    return otherUsers.length === 0
                                        ? "-"
                                        : otherUsers.length === 1
                                        ? otherUsers[0]
                                        : otherUsers[0] + "..."
                                }}
                            />
                            <FunctionField
                                label={
                                    <Box display="flex" width="100%" justifyContent="center">
                                        Status
                                    </Box>
                                }
                                render={(record: any) => {
                                    return (
                                        <Box display="flex" width="100%" justifyContent="center">
                                            <Chip
                                                label={
                                                    record.status === "Draft"
                                                        ? "Draft"
                                                        : record.status === "New"
                                                        ? "Submitted"
                                                        : record.status === "In Progress"
                                                        ? "Processing"
                                                        : record.status === "Completed"
                                                        ? "Completed"
                                                        : "Cancelled"
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
