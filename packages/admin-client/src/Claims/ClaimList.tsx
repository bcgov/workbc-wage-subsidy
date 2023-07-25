import { Box, Chip } from "@mui/material"
import { FunctionField, Identifier, List, TextField, TopToolbar } from "react-admin"
import { DatagridStyles } from "../common/styles/DatagridStyles"
import { ClaimListAside } from "./ClaimListAside"
import { useContext, useEffect, useState } from "react"
import CatchmentLabel from "../common/components/CatchmentLabel/CatchmentLabel"
import NotifyButton from "../common/components/NotifyButton/NotifyButton"
import { CatchmentContext } from "../common/contexts/CatchmentContext/CatchmentContext"
import CustomDatagrid from "../common/components/CustomDatagrid/CustomDatagrid"
import CatchmentDropdown from "../common/components/CatchmentDropdown/CatchmentDropdown"

export const claimStatusFilters = {
    All: { label: "All" },
    New: { label: "New", status: "Submitted" },
    InProgress: { label: "In Progress", status: "Processing" },
    Completed: { label: "Completed", status: "Completed" },
    Cancelled: { label: "Cancelled", status: "Cancelled" }
} as { [key: string]: any }

const ListActions = ({ notificationsOn, handleNotifyButton, catchmentDropdown }) => (
    <TopToolbar>
        <Box display="flex" alignItems="end">
            <NotifyButton notificationsOn={notificationsOn} onClick={handleNotifyButton} />
            {catchmentDropdown}
        </Box>
    </TopToolbar>
)

export const ClaimList = (props: any) => {
    const cc = useContext(CatchmentContext)
    const [listFilter, setListFilter] = useState({
        ...claimStatusFilters["All"],
        ...{ catchmentno: cc.catchment.id }
    })
    const [notificationsOn, setNotificationsOn] = useState(true)

    const handleCatchmentSelect = (event) => {
        // Update global catchment state in catchment context.
        cc.changeCatchment(event.target.value)
    }

    const handleNotifyButton = (event) => {
        setNotificationsOn(notificationsOn ? false : true)
    }

    useEffect(() => {
        // When catchment is changed, update list filter.
        const statusFilter = claimStatusFilters[listFilter.label === "In Progress" ? "InProgress" : listFilter.label]
        setListFilter({ ...statusFilter, ...{ catchmentno: cc.catchment.id } })
    }, [cc.catchment])

    return (
        <>
            <CatchmentLabel catchment={cc.catchment.name} />
            <List
                {...props}
                actions={
                    <ListActions
                        notificationsOn={notificationsOn}
                        handleNotifyButton={handleNotifyButton}
                        catchmentDropdown={
                            <CatchmentDropdown
                                catchments={cc.catchments}
                                value={cc.catchment.id}
                                onChange={handleCatchmentSelect}
                            />
                        }
                    />
                }
                filter={listFilter}
                filterDefaultValues={{ catchmentno: cc.catchment.id }}
                aside={<ClaimListAside />}
            >
                <CustomDatagrid
                    calculatorButton={true}
                    sx={DatagridStyles}
                    rowClick={(id: Identifier, resource: string, record: any) => {
                        // Temporary click functionality (opens form in a new tab) (will get replaced by embed functionality eventually)
                        if (record.status === "Submitted") {
                            // submitted
                            window.open(`${process.env.REACT_APP_VIEW_URL}${record.form_submission_id}`)
                        } else if (record.status === "Draft" && record.form_submission_id) {
                            // saved
                            window.open(`${process.env.REACT_APP_DRAFT_URL}${record.form_submission_id}`)
                        } else {
                            // new
                            if (record.form_type === "Have Employee")
                                window.open(`${process.env.REACT_APP_HAVE_EMPLOYEE_URL}&token=${id}`)
                            else if (record.form_type === "Need Employee")
                                window.open(`${process.env.REACT_APP_NEED_EMPLOYEE_URL}&token=${id}`)
                        }
                        return "" // rowClick expects a path to be returned
                    }}
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
                        render={
                            (record: any) =>
                                record.form_submitted_date ? record.form_submitted_date.split("T")[0] : "-" // remove timestamp
                        }
                    />
                    <TextField label="Associated Application ID" source="associated_application_id" emptyText="-" />
                    <FunctionField
                        label=""
                        render={(record: any) => (
                            <Box display="flex" width="100%" justifyContent="center">
                                <Chip
                                    label={
                                        record.status === "Processing"
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
                                            ? "info"
                                            : record.status === "Submitted"
                                            ? "primary"
                                            : record.status === "Processing"
                                            ? "warning"
                                            : record.status === "Completed"
                                            ? "success"
                                            : record.status === "Cancelled"
                                            ? "error"
                                            : "info"
                                    }
                                />
                            </Box>
                        )}
                    />
                </CustomDatagrid>
            </List>
        </>
    )
}
