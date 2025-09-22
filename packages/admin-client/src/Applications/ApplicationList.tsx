import { Box, Chip, Button, Tooltip } from "@mui/material"
import { FunctionField, Identifier, List, TextField, useUnselectAll, useRedirect, Loading } from "react-admin"
import { useContext, useEffect, useState } from "react"
import CatchmentLabel from "../common/components/CatchmentLabel/CatchmentLabel"
import { CatchmentContext } from "../common/contexts/CatchmentContext/CatchmentContext"
import CustomDatagrid from "../common/components/CustomDatagrid/CustomDatagrid"
import { ListActions } from "../common/components/ListActions/ListActions"
import { ListAside } from "../common/components/ListAside/ListAside"
import { WorkBcCentres } from "../common/data/WorkBcCentres"
import { CustomSearchInput } from "../common/components/CustomSearchInput/CustomSearchInput"
import { faCopy } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { COLOURS } from "../Colours"

export const applicationStatusFilters = {
    All: { label: "All" },
    New: { label: "New", status: "New" },
    InProgress: { label: "In Progress", status: "In Progress" },
    Completed: { label: "Completed", status: "Completed" },
    Cancelled: { label: "Cancelled", status: "Cancelled" }
}

export const ApplicationList = (props: any) => {
    const cc = useContext(CatchmentContext)
    const unselectAll = useUnselectAll("applications")
    const [statusFilter, setStatusFilter] = useState(applicationStatusFilters["All"])
    const redirect = useRedirect()
    const [listIsLoading, setListIsLoading] = useState(true)
    const [listAsideIsLoading, setListAsideIsLoading] = useState(true)
    const [ready, setReady] = useState(false)
    const [copiedID, setCopiedID] = useState(null)

    const handleSubmissionIDClick = (form_confirmation_id: any) => {
        navigator.clipboard.writeText(form_confirmation_id)
        setCopiedID(form_confirmation_id)
        setTimeout(() => setCopiedID(null), 2000)
    }

    useEffect(() => {
        unselectAll()
    }, [cc.catchment])

    useEffect(() => {
        if (!listIsLoading && !listAsideIsLoading) {
            setReady(true)
        }
    }, [listIsLoading, listAsideIsLoading])

    const handleRowClick = (id: Identifier, resource: string, record: any) => {
        // In admin client, applications are never in draft.
        if (record.form_submission_id) {
            redirect("/ViewForm/applications/" + record.id, "")
        } else {
            return "" // rowClick expects a path to be returned
        }
    }

    const applicationFilters = [
        <CustomSearchInput
            placeholder={cc.catchment.id !== 0 ? "Search this catchment..." : "Search all catchments..."}
            source="search_query"
            alwaysOn
            style={{ width: "18em" }}
            containerStyle={{ transform: "translate(0em, -2.8em)" }}
        />
    ]

    return (
        <>
            <Box id="main-content-custom" tabIndex={0} aria-label="main content">
                {!ready && <Loading sx={{ marginTop: 20 }}></Loading>}
                {cc.catchments.length > 0 && cc.catchment.id >= 0 && (
                    <Box hidden={!ready} sx={{ paddingTop: "2em" }}>
                        <CatchmentLabel catchment={cc.catchment.name} />
                        <List
                            {...props}
                            actions={<ListActions catchment={cc.catchment.id} />}
                            filter={{ ...statusFilter, catchmentno: cc.catchment.id }}
                            filterDefaultValues={{ ...applicationStatusFilters["All"], catchmentno: cc.catchment.id }}
                            filters={applicationFilters}
                            aside={
                                <ListAside
                                    statusFilters={applicationStatusFilters}
                                    statusFilter={statusFilter}
                                    setStatusFilter={setStatusFilter}
                                    setIsLoading={setListAsideIsLoading}
                                />
                            }
                            sort={{
                                field: "form_submitted_date,updated_date,created_date",
                                order: "DESC"
                            }}
                        >
                            <CustomDatagrid
                                rowClick={handleRowClick}
                                ariaLabel="applications list"
                                setIsLoading={setListIsLoading}
                            >
                                <FunctionField
                                    label="Submission ID"
                                    source="form_confirmation_id"
                                    render={(record: any) => (
                                        <Box display="flex" alignItems="center" gap={0}>
                                            <TextField
                                                label={record.form_confirmation_id}
                                                aria-label={record.form_confirmation_id}
                                                source="form_confirmation_id"
                                                emptyText="-"
                                            />
                                            <Tooltip
                                                title={
                                                    copiedID === record.form_confirmation_id
                                                        ? "Copied!"
                                                        : "Copy Submission ID"
                                                }
                                                aria-label={record.form_confirmation_id}
                                                aria-hidden={true}
                                            >
                                                <Button
                                                    aria-label={`Copy Submission ID ${record.form_confirmation_id}`}
                                                    style={{
                                                        flex: 1,
                                                        justifyContent: "flex-end",
                                                        minWidth: "unset",
                                                        paddingLeft: 3
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleSubmissionIDClick(record.form_confirmation_id)
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.stopPropagation()
                                                            handleSubmissionIDClick(record.form_confirmation_id)
                                                        }
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCopy}
                                                        style={{ color: COLOURS.LIGHTBLUE_TEXT }}
                                                    />
                                                </Button>
                                            </Tooltip>
                                        </Box>
                                    )}
                                />
                                <TextField label="Organization" source="organization" emptyText="-" />
                                <TextField label="Position Title" source="position_title" emptyText="-" />
                                <FunctionField
                                    label="Submitted"
                                    sortBy="form_submitted_date,updated_date,created_date"
                                    sortByOrder="DESC"
                                    render={(record: any) =>
                                        record.form_submitted_date
                                            ? new Date(record.form_submitted_date).toLocaleDateString()
                                            : "-"
                                    }
                                />
                                <FunctionField
                                    label="Last Updated"
                                    sortBy="updated_date,created_date"
                                    sortByOrder="DESC"
                                    render={(record: any) =>
                                        record.form_submitted_date
                                            ? new Date(record.updated_date).toLocaleDateString()
                                            : "-"
                                    }
                                />
                                <FunctionField
                                    label="WorkBC Centre"
                                    sortBy="workbc_centre"
                                    sortByOrder="DESC"
                                    render={(record: any) => {
                                        const chipLabel =
                                            record?.workbc_centre &&
                                            Object.keys(WorkBcCentres).includes(record.workbc_centre)
                                                ? // Remove 'WorkBC Centre -' prefix before rendering.
                                                  WorkBcCentres[record.workbc_centre].substring(
                                                      WorkBcCentres[record.workbc_centre].indexOf("-") + 2
                                                  )
                                                : "Unassigned"
                                        return <Chip label={chipLabel} size="small" />
                                    }}
                                />
                                <FunctionField
                                    label="Status"
                                    sortBy="status"
                                    render={(record: any) => (
                                        <Box display="flex" width="100%" justifyContent="center">
                                            <Chip
                                                label={record.status}
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
                                    )}
                                />
                            </CustomDatagrid>
                        </List>
                    </Box>
                )}
            </Box>
        </>
    )
}
