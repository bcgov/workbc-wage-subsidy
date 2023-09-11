import { Box, Chip } from "@mui/material"
import { FunctionField, List, TextField } from "react-admin"
import { applicationStatusFilters } from "../Applications/ApplicationList"
import { DatagridStyles } from "../common/styles/DatagridStyles"
import { CustomSearchInput } from "./ClaimCustomSearchInput"
import CustomDatagrid from "../common/components/CustomDatagrid/CustomDatagrid"

const applicationFilters = [
    <CustomSearchInput
        placeholder="Search for application..."
        source="form_confirmation_id"
        alwaysOn
        style={{ width: "18em" }}
    />
]

export const ClaimCreateSelectApplication = (props: any) => {
    const handleClick = (id, resource, record) => {
        return "/claims/create/Form/" + record.form_confirmation_id
    }

    return (
        <Box minWidth="60em" minHeight="35em">
            <List
                {...props}
                resource="applications"
                filter={applicationStatusFilters["Completed"]}
                filters={applicationFilters}
                filterDefaultValues={{ dummyUserFilter: -1 }} // TODO: filter by current user.
                actions={false} // Disable default list actions.
                sx={{
                    "& .RaList-content": {
                        padding: "0em 1em"
                    },
                    // Right-align search bar.
                    "& .RaFilterForm-filterFormInput": {
                        justifyContent: "end",
                        width: "100%",
                        minWidth: "60em"
                    }
                }}
            >
                <p>
                    <strong>Select the application you want to submit a claim for</strong>
                </p>
                <CustomDatagrid
                    sx={DatagridStyles}
                    rowClick={handleClick}
                    bulkActionButtons={false}
                    ariaLabel="list of completed applications"
                    empty={
                        <p style={{ padding: "16px" }}>
                            You must have at least one completed application in order to submit a claim
                        </p>
                    }
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
                    <TextField label="Shared With" source="shared_with" emptyText="-" />
                    <FunctionField
                        label=""
                        render={(record: any) => (
                            <Box display="flex" width="100%" justifyContent="center">
                                <Chip
                                    label={record.status}
                                    size="small"
                                    color={record.status === "Completed" ? "success" : "error"}
                                />
                            </Box>
                        )}
                    />
                </CustomDatagrid>
            </List>
            <Box display="flex" justifyContent="right">
                <img width="110em" src="/woman-checkmark.svg" alt="" style={{ transform: "translate(-2em, 2.5em)" }} />
            </Box>
        </Box>
    )
}
