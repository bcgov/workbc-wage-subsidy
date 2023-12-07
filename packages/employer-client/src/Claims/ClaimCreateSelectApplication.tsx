import { Box, Chip } from "@mui/material"
import { FunctionField, List, LoadingIndicator, TextField, useCreate, useGetIdentity, useRedirect } from "react-admin"
import { applicationStatusFilters } from "../Applications/ApplicationList"
import { DatagridStyles } from "../common/styles/DatagridStyles"
import { CustomSearchInput } from "./ClaimCustomSearchInput"
import CustomDatagrid from "../common/components/CustomDatagrid/CustomDatagrid"
import { v4 as uuidv4 } from "uuid"
import { useState } from "react"

const applicationFilters = [
    <CustomSearchInput
        placeholder="Search for application..."
        source="form_confirmation_id"
        alwaysOn
        style={{ width: "18em" }}
    />
]

export const ClaimCreateSelectApplication = (props: any) => {
    const { identity } = useGetIdentity()
    const redirect = useRedirect()
    const [create] = useCreate()
    const [loading, setLoading] = useState(false)

    const handleClick = async (id, resource, record) => {
        if (identity?.guid && record?.form_confirmation_id && !loading) {
            setLoading(true)
            await create(
                "claims",
                { data: { formKey: uuidv4(), guid: identity.guid, application_id: record.form_confirmation_id } },
                {
                    onSuccess: (data) => {
                        setLoading(false)
                        redirect("/ViewForm/claims/" + data.id, "")
                    },
                    onError: () => {
                        setLoading(false)
                    }
                }
            )
        }
    }

    return (
        <Box minWidth="60em" minHeight="35em">
            <>
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
                    <div>
                        <p>
                            <strong>Select the application you want to submit a claim for</strong>
                        </p>
                    </div>

                    <CustomDatagrid
                        sx={DatagridStyles}
                        rowClick={handleClick}
                        ariaLabel="list of completed applications"
                        rowAriaLabel="create a claim form for application"
                        disableBulkActions={true}
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
                            sortBy="form_submitted_date,updated_date,created_date"
                            sortByOrder="DESC"
                            render={(record: any) =>
                                record.form_submitted_date
                                    ? new Date(record.form_submitted_date).toLocaleDateString()
                                    : "-"
                            }
                        />
                        <FunctionField
                            label={
                                <Box display="flex" width="100%" justifyContent="center">
                                    Status
                                </Box>
                            }
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
                {/* Pad the bottom of this box to account for the translation applied to the image. */}
                <Box display="flex" justifyContent="right" style={{ paddingBottom: "3em" }}>
                    <img
                        width="110em"
                        src="/woman-checkmark.svg"
                        alt=""
                        style={{ transform: "translate(-2em, 2.5em)" }}
                    />
                </Box>
            </>
        </Box>
    )
}
