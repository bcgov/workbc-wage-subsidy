import { Box, Chip } from "@mui/material"
import { Datagrid, FunctionField, List, TextField, useStore } from "react-admin"
import { FormBulkActionButtons } from "../common/components/FormBulkActionButtons/FormBulkActionButtons"
import { ListActions } from "../common/components/ListActions/ListActions"
import { DatagridStyles } from "../common/styles/DatagridStyles"
import { ApplicationCreateRedirect } from "./ApplicationCreateRedirect"
import { ApplicationListAside } from "./ApplicationListAside"

export const applicationStatusFilters = {
    All: { label: "All" },
    NotSubmitted: { label: "Not Submitted", status: "not submitted" },
    Submitted: { label: "Submitted", applicationstatus: "New", status: "submitted" },
    Processing: { label: "Processing", applicationstatus: "In Progress", status: "submitted" },
    Completed: { label: "Completed", applicationstatus: "Completed", status: "submitted" },
    Cancelled: { label: "Cancelled", status: "cancelled" }
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
            <Datagrid bulkActionButtons={<FormBulkActionButtons />} sx={DatagridStyles} rowClick="show">
                <TextField label="Submission ID" source="id" emptyText="-" />
                <TextField label="Position Title" source="title" emptyText="-" />
                <TextField label="Number of Positions" source="numberofpositions0" emptyText="-" />{" "}
                {/* TODO - once submitted date is implemented */}
                <TextField label="Submitted Date" source="submitted" emptyText="-" /> {/* TODO */}
                <TextField label="Shared With" source="sharedwith" emptyText="-" /> {/* TODO */}
                <FunctionField
                    label=""
                    render={(record: any) => (
                        <Box display="flex" width="100%" justifyContent="center">
                            <Chip
                                label={
                                    record.status === "submitted" && record.applicationstatus === "New"
                                        ? "Submitted"
                                        : record.status === "submitted" && record.applicationstatus === "In Progress"
                                        ? "Processing"
                                        : record.status === "submitted" && record.applicationstatus === "Completed"
                                        ? "Completed"
                                        : record.status === "cancelled"
                                        ? "Cancelled"
                                        : "Not Submitted"
                                }
                                size="small"
                                color={
                                    record.status === "submitted" && record.applicationstatus === "New"
                                        ? "primary"
                                        : record.status === "submitted" && record.applicationstatus === "In Progress"
                                        ? "warning"
                                        : record.status === "submitted" && record.applicationstatus === "Completed"
                                        ? "success"
                                        : record.status === "cancelled"
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
