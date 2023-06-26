import { Box, Chip } from "@mui/material"
import { Datagrid, FunctionField, List, TextField, useStore } from "react-admin"
import { FormBulkActionButtons } from "../common/components/FormBulkActionButtons/FormBulkActionButtons"
import { ListActions } from "../common/components/ListActions/ListActions"
import { DatagridStyles } from "../common/styles/DatagridStyles"
import { ClaimCreateRedirect } from "./ClaimCreateRedirect"
import { ClaimListAside } from "./ClaimListAside"

export const claimStatusFilters = {
    All: { label: "All" },
    NotSubmitted: { label: "Not Submitted", status: "not submitted" },
    Submitted: { label: "Submitted", status: "submitted" },
    Cancelled: { label: "Cancelled", status: "cancelled" }
} as { [key: string]: any }

export const ClaimList = (props: any) => {
    const [statusFilter] = useStore("resources.claim.list.statusFilter", claimStatusFilters.All)

    return (
        <List
            {...props}
            actions={<ListActions createButtonLabel="New Claim Form" />}
            filter={statusFilter}
            filters={[]}
            aside={<ClaimListAside />}
            empty={<ClaimCreateRedirect />}
        >
            <Datagrid bulkActionButtons={<FormBulkActionButtons />} sx={DatagridStyles} rowClick="show">
                <TextField label="Submission ID" source="id" emptyText="-" />
                <TextField label="Position Title" source="title" emptyText="-" />
                <TextField label="Number of Positions" source="numberofpositions0" emptyText="-" />{" "}
                {/* TODO - once submitted date is implemented */}
                <TextField label="Submitted Date" source="submitted" emptyText="-" /> {/* TODO */}
                <TextField label="Shared With" source="sharedwith" emptyText="-" /> {/* TODO */}
                <TextField label="Associated Application ID" source="applicationid" emptyText="-" />
                <FunctionField
                    label=""
                    render={(record: any) => (
                        <Box display="flex" width="100%" justifyContent="center">
                            <Chip
                                label={
                                    record.status === "submitted"
                                        ? "Submitted"
                                        : record.status === "cancelled"
                                        ? "Cancelled"
                                        : "Not Submitted"
                                }
                                size="small"
                                color={
                                    record.status === "submitted"
                                        ? "primary"
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
