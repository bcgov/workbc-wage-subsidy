import { Box, Chip } from "@mui/material"
import { Datagrid, FunctionField, List, TextField } from "react-admin"
import { applicationStatusFilters } from "../Applications/ApplicationList"
import { DatagridStyles } from "../common/styles/DatagridStyles"
import { CustomSearchInput } from "./ClaimCustomSearchInput"

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
        <Box display="flex" width="100%" justifyContent="center" minWidth="70em">
            <Box minWidth="70em" maxWidth="70em" minHeight="40em">
                <List
                    {...props}
                    resource="applications"
                    filter={applicationStatusFilters["Completed"]}
                    filters={applicationFilters}
                    actions={<span />} // Disable default list actions.
                    sx={{ "& .RaList-content": { padding: "0em 1em" } }}
                >
                    <p>
                        <strong>Select the application you want to submit a claim for</strong>
                    </p>
                    <Datagrid sx={DatagridStyles} rowClick={handleClick} bulkActionButtons={false}>
                        <TextField label="Submission ID" source="form_confirmation_id" emptyText="-" />
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
                                        label={record.status}
                                        size="small"
                                        color={record.status === "Completed" ? "success" : "error"}
                                    />
                                </Box>
                            )}
                        />
                    </Datagrid>
                </List>
                <Box display="flex" justifyContent="right">
                    <img
                        width="110em"
                        src="/woman-checkmark.svg"
                        alt=""
                        style={{ transform: "translate(-2em, 2.5em)" }}
                    />
                </Box>
            </Box>
        </Box>
    )
}
