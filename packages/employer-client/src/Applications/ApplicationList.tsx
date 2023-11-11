import { Box, Chip } from "@mui/material"
import { useState, useCallback, useEffect } from "react"
import { FunctionField, Identifier, List, TextField, useGetIdentity, useRedirect } from "react-admin"
import CustomDatagrid from "../common/components/CustomDatagrid/CustomDatagrid"
import { ListActions } from "../common/components/ListActions/ListActions"
import { ListAside } from "../common/components/ListAside/ListAside"
import { DatagridStyles } from "../common/styles/DatagridStyles"
import { SharedWithModal } from "../common/components/SharedWithField/SharedWithModal"
import { SharedWithField } from "../common/components/SharedWithField/SharedWithField"

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
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [sharedUsers, setSharedUsers] = useState([])
    const [sharedFormId, setSharedFormId] = useState("")
    const [allowSharing, setAllowSharing] = useState(false)

    const handleRowClick = (id: Identifier, resource: string, record: any) => {
        if (record.status === "Draft" && record.form_submission_id) {
            redirect("/ViewForm/Draft/applications/" + record.form_submission_id, "")
        } else if (record.form_submission_id) {
            redirect("/ViewForm/View/applications/" + record.form_submission_id, "")
        } else {
            return "" // rowClick expects a path to be returned
        }
    }

    const openModal = useCallback((formId, sharedUsers) => {
        setSharedFormId(formId)
        setSharedUsers(sharedUsers)
        setModalIsOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        setSharedFormId("")
        setSharedUsers([])
        setModalIsOpen(false)
    }, [])

    useEffect(() => {
        setAllowSharing(identity && identity.businessGuid && identity.businessName)
    }, [identity])

    return (
        <>
            {identity !== undefined && (
                <>
                    <Box id="main-content-custom" tabIndex={0} aria-label="main content">
                        <List
                            {...props}
                            actions={<ListActions createButtonLabel="New Application" />}
                            filter={statusFilter}
                            filterDefaultValues={statusFilter}
                            aside={
                                <ListAside
                                    statusFilters={applicationStatusFilters}
                                    statusFilter={statusFilter}
                                    setStatusFilter={setStatusFilter}
                                />
                            }
                            sort={{
                                field: "form_submitted_date,updated_date,created_date",
                                order: "DESC"
                            }}
                        >
                            <CustomDatagrid sx={DatagridStyles} rowClick={handleRowClick} ariaLabel="applications list">
                                <TextField label="Submission ID" source="form_confirmation_id" emptyText="-" />
                                <TextField label="Position Title" source="position_title" emptyText="-" />
                                <TextField label="Number of Positions" source="num_positions" emptyText="-" />{" "}
                                <FunctionField
                                    label="Submitted Date"
                                    sortBy="form_submitted_date,updated_date,created_date"
                                    sortByOrder="DESC"
                                    render={
                                        (record: any) =>
                                            record.form_submitted_date ? record.form_submitted_date.split("T")[0] : "-" // remove timestamp
                                    }
                                />
                                {allowSharing && <SharedWithField label="Shared With" openModal={openModal} />}
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
                    {allowSharing && (
                        <Box>
                            <SharedWithModal
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                                contentLabel="shared users"
                                formId={sharedFormId}
                                sharedUsers={sharedUsers}
                                resource="applications"
                            />
                        </Box>
                    )}
                </>
            )}
        </>
    )
}
