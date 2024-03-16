import { Box, Chip } from "@mui/material"
import { useCallback, useContext, useEffect, useState } from "react"
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
    const dataProvider = useDataProvider()
    const [synced, setSynced] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [ready, setReady] = useState(false)
    const ec = useContext(EmployerContext)

    const syncClaims = () => {
        dataProvider.sync("claims").then(({ data }) => {
            setSynced(true)
        })
    }

    const handleRowClick = (id: Identifier, resource: string, record: any) => {
        if (record.status === "Draft" && record.id && record.form_submission_id) {
            redirect("/ViewForm/claims/" + record.id, "")
        } else if (record.status !== "Draft" && record.id && record.form_submission_id) {
            redirect("/ViewForm/claims/" + record.id, "")
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
            syncClaims()
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
                                    actions={<ListActions createButtonLabel="New Claim Form" />}
                                    filter={statusFilter}
                                    filterDefaultValues={claimStatusFilters["All"]}
                                    aside={
                                        <ListAside
                                            statusFilters={claimStatusFilters}
                                            statusFilter={statusFilter}
                                            setStatusFilter={setStatusFilter}
                                        />
                                    }
                                    sort={{
                                        field: "updated_date,form_submitted_date,created_date",
                                        order: "DESC"
                                    }}
                                >
                                    <CustomDatagrid
                                        sx={DatagridStyles}
                                        rowClick={handleRowClick}
                                        ariaLabel="claims list"
                                        setIsFetching={setIsFetching}
                                    >
                                        <TextField label="Submission ID" source="form_confirmation_id" emptyText="-" />
                                        <TextField label="Position Title" source="position_title" emptyText="-" />
                                        <FunctionField
                                            label="Employee Name"
                                            sortBy="employee_first_name,employee_last_name"
                                            sortByOrder="DESC"
                                            render={(record: any) =>
                                                record.employee_first_name || record.employee_last_name
                                                    ? `${record.employee_first_name ?? ""} ${
                                                          record.employee_last_name ?? ""
                                                      }`
                                                    : "-"
                                            }
                                        />
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
                        resource="claims"
                    />
                </Box>
            )}
        </>
    )
}
