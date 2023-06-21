import { faHandshake } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Box, Chip } from "@mui/material"
import { CreateButton, Datagrid, FunctionField, List, TextField, TopToolbar, useStore } from "react-admin"
import { ClaimCreateRedirect } from "./ClaimCreateRedirect"
import { ClaimListAside } from "./ClaimListAside"

const ListActions = () => (
    <TopToolbar sx={{ paddingTop: "5vh" }}>
        <div>
            <CreateButton label="New Claim Form" />
        </div>
    </TopToolbar>
)

const FormBulkActionButtons = () => (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", cursor: "pointer" }}>
        <FontAwesomeIcon icon={faHandshake} style={{ marginRight: 10 }} />
        SHARE
    </div>
)

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
            actions={<ListActions />}
            filter={statusFilter}
            filters={[]}
            aside={<ClaimListAside />}
            empty={<ClaimCreateRedirect />}
        >
            <Datagrid
                bulkActionButtons={<FormBulkActionButtons />}
                sx={{
                    "& .column-lock": {
                        padding: "6px 0",
                        "& svg": { verticalAlign: "middle" }
                    },
                    "& .RaDatagrid-rowCell": {
                        textAlign: "left",
                        padding: "0.9em 1.3em"
                    },
                    "& .RaDatagrid-headerCell": {
                        fontWeight: "bold",
                        textAlign: "left"
                    }
                }}
                rowClick="show"
            >
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
