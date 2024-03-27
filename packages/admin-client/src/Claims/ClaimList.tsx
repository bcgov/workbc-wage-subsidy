import { Box, Chip } from "@mui/material"
import { FunctionField, Identifier, List, Loading, TextField, useRedirect, useUnselectAll } from "react-admin"
import { useContext, useEffect, useState } from "react"
import CatchmentLabel from "../common/components/CatchmentLabel/CatchmentLabel"
import { CatchmentContext } from "../common/contexts/CatchmentContext/CatchmentContext"
import CustomDatagrid from "../common/components/CustomDatagrid/CustomDatagrid"
import { ListActions } from "../common/components/ListActions/ListActions"
import { ListAside } from "../common/components/ListAside/ListAside"
import { WorkBcCentres } from "../common/data/WorkBcCentres"
import { CustomSearchInput } from "../common/components/CustomSearchInput/CustomSearchInput"

export const claimStatusFilters = {
    All: { label: "All" },
    New: { label: "New", status: "New" },
    InProgress: { label: "In Progress", status: "In Progress" },
    Completed: { label: "Completed", status: "Completed" },
    Cancelled: { label: "Cancelled", status: "Cancelled" }
} as { [key: string]: any }

export const ClaimList = (props: any) => {
    const cc = useContext(CatchmentContext)
    const unselectAll = useUnselectAll("claims")
    const [statusFilter, setStatusFilter] = useState(claimStatusFilters["All"])
    const redirect = useRedirect()
    const [listIsLoading, setListIsLoading] = useState(true)
    const [listAsideIsLoading, setListAsideIsLoading] = useState(true)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        unselectAll()
    }, [cc.catchment])

    useEffect(() => {
        if (!listIsLoading && !listAsideIsLoading) {
            setReady(true)
        }
    }, [listIsLoading, listAsideIsLoading])

    const handleRowClick = (id: Identifier, resource: string, record: any) => {
        if (record.service_provider_form_submission_id) {
            redirect("/ViewForm/claims/" + record.id, "")
        } else {
            return "" // rowClick expects a path to be returned
        }
    }

    const claimFilters = [
        <CustomSearchInput
            placeholder={cc.catchment.id > 0 ? "Search this catchment..." : "Search all catchments..."}
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
                            filterDefaultValues={{ ...claimStatusFilters["All"], catchmentno: cc.catchment.id }}
                            filters={claimFilters}
                            aside={
                                <ListAside
                                    statusFilters={claimStatusFilters}
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
                                showCalculatorButton={true}
                                rowClick={handleRowClick}
                                ariaLabel="claims list"
                                setIsLoading={setListIsLoading}
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
                                <FunctionField
                                    label="WorkBC Centre"
                                    sortBy="workbc_centre"
                                    sortByOrder="DESC"
                                    render={(record: any) => {
                                        const chipLabel =
                                            record?.workbc_centre &&
                                            Object.keys(WorkBcCentres).includes(record.workbc_centre)
                                                ? WorkBcCentres[record.workbc_centre].substring(
                                                      WorkBcCentres[record.workbc_centre].indexOf("-") + 2
                                                  )
                                                : "Unassigned"
                                        return <Chip label={chipLabel} size="small" />
                                    }}
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
                                                label={
                                                    record.status === "In Progress"
                                                        ? "In Progress"
                                                        : record.status === "Completed"
                                                        ? "Completed"
                                                        : record.status === "Cancelled"
                                                        ? "Cancelled"
                                                        : "New"
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
