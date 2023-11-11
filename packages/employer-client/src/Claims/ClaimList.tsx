import { Box, Chip } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { FunctionField, Identifier, List, TextField, useGetIdentity, useRedirect } from "react-admin"
import CustomDatagrid from "../common/components/CustomDatagrid/CustomDatagrid"
import { FormBulkActionButtons } from "../common/components/FormBulkActionButtons/FormBulkActionButtons"
import { ListActions } from "../common/components/ListActions/ListActions"
import { ListAside } from "../common/components/ListAside/ListAside"
import { DatagridStyles } from "../common/styles/DatagridStyles"
import { SharedWithModal } from "../common/components/SharedWithField/SharedWithModal"
import { SharedWithField } from "../common/components/SharedWithField/SharedWithField"

export const claimStatusFilters = {
    All: { label: "All" },
    NotSubmitted: { label: "Draft", status: ["Draft"] },
    Submitted: { label: "Submitted", status: ["New", "In Progress", "Completed"] },
    Cancelled: { label: "Cancelled", status: ["Cancelled"] }
} as { [key: string]: any }

export const ClaimList = (props: any) => {
    const [statusFilter, setStatusFilter] = useState(claimStatusFilters["All"])
    const { identity } = useGetIdentity()
    const redirect = useRedirect()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [sharedUsers, setSharedUsers] = useState([])
    const [sharedFormId, setSharedFormId] = useState("")
    const [allowSharing, setAllowSharing] = useState(false)

    const handleRowClick = (id: Identifier, resource: string, record: any) => {
        if (record.status === "Draft" && record.form_submission_id) {
            redirect("/ViewForm/Draft/claims/" + record.form_submission_id, "")
        } else if (record.status !== "Draft" && record.form_submission_id) {
            redirect("/ViewForm/View/claims/" + record.form_submission_id, "")
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
                            actions={<ListActions createButtonLabel="New Claim Form" />}
                            filter={statusFilter}
                            filterDefaultValues={statusFilter}
                            aside={
                                <ListAside
                                    statusFilters={claimStatusFilters}
                                    statusFilter={statusFilter}
                                    setStatusFilter={setStatusFilter}
                                />
                            }
                            sort={{
                                field: "form_submitted_date,updated_date,created_date",
                                order: "DESC"
                            }}
                        >
                            <CustomDatagrid
                                bulkActionButtons={<FormBulkActionButtons />}
                                sx={DatagridStyles}
                                rowClick={handleRowClick}
                                ariaLabel="claims list"
                            >
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
                                    sortBy="form_submitted_date,updated_date,created_date"
                                    sortByOrder="DESC"
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
                                {allowSharing && <SharedWithField label="Shared With" openModal={openModal} />}
                                <FunctionField
                                    label={
                                        <Box display="flex" width="100%" justifyContent="center">
                                            Status
                                        </Box>
                                    }
                                    render={(record: any) => (
                                        <Box display="flex" width="100%" justifyContent="center">
                                            <Chip
                                                label={
                                                    record.status === "New" ||
                                                    record.status === "In Progress" ||
                                                    record.status === "Completed"
                                                        ? "Submitted"
                                                        : record.status
                                                }
                                                size="small"
                                                color={
                                                    record.status === "New" ||
                                                    record.status === "In Progress" ||
                                                    record.status === "Completed"
                                                        ? "info"
                                                        : record.status === "Cancelled"
                                                        ? "error"
                                                        : "secondary"
                                                }
                                            />
                                        </Box>
                                    )}
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
                                resource="claims"
                            />
                        </Box>
                    )}
                </>
            )}
        </>
    )
}
