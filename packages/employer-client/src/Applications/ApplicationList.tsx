import { Box, Chip } from "@mui/material"
import { useState, useCallback, useEffect, useContext } from "react"
import {
    FunctionField,
    Identifier,
    List,
    Loading,
    TextField,
    useDataProvider,
    useGetIdentity,
    useRedirect
} from "react-admin"
import CustomDatagrid from "../common/components/CustomDatagrid/CustomDatagrid"
import { ListActions } from "../common/components/ListActions/ListActions"
import { ListAside } from "../common/components/ListAside/ListAside"
import { DatagridStyles } from "../common/styles/DatagridStyles"
import { SharedWithModal } from "../common/components/SharedWithField/SharedWithModal"
import { SharedWithField } from "../common/components/SharedWithField/SharedWithField"
import { EmployerContext } from "../common/contexts/EmployerContext"

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
    const dataProvider = useDataProvider()
    const [synced, setSynced] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [ready, setReady] = useState(false)
    const ec = useContext(EmployerContext)

    const syncApplications = () => {
        dataProvider.sync("applications").then(({ data }) => {
            setSynced(true)
        })
    }

    const handleRowClick = (id: Identifier, resource: string, record: any) => {
        if (record.status === "Draft" && record.id && record.form_submission_id) {
            redirect("/ViewForm/applications/" + record.id, "")
        } else if (record.id && record.form_submission_id) {
            redirect("/ViewForm/applications/" + record.id, "")
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

    useEffect(() => {
        if (synced && !isFetching) {
            setReady(true)
        }
    }, [isFetching])

    useEffect(() => {
        if (identity && ec.profileExists && !synced) {
            syncApplications()
        }
    }, [identity, ec.profileExists])

    return (
        <>
            <Box id="main-content-custom" tabIndex={0} aria-label="main content">
                {!ready && <Loading sx={{ marginTop: 20 }}></Loading>}
                {identity !== undefined && (
                    <>
                        {synced && (
                            <Box hidden={!ready}>
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
                                    <CustomDatagrid
                                        sx={DatagridStyles}
                                        rowClick={handleRowClick}
                                        ariaLabel="applications list"
                                        setIsFetching={setIsFetching}
                                    >
                                        <TextField label="Submission ID" source="form_confirmation_id" emptyText="-" />
                                        <TextField label="Position Title" source="position_title" emptyText="-" />
                                        <TextField
                                            label="Number of Positions"
                                            source="num_positions"
                                            emptyText="-"
                                        />{" "}
                                        <FunctionField
                                            label="Submitted Date"
                                            sortBy="form_submitted_date,updated_date,created_date"
                                            sortByOrder="DESC"
                                            render={(record: any) => {
                                                return record.form_submitted_date
                                                    ? new Date(record.form_submitted_date).toLocaleDateString()
                                                    : "-" // remove timestamp
                                            }}
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
                        )}
                    </>
                )}
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
    )
}
