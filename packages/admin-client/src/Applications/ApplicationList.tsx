import { Box, Chip } from "@mui/material"
import { Datagrid, FunctionField, Identifier, List, TextField, TopToolbar, required, useStore } from "react-admin"
import { CustomSelectInput } from "../common/components/CustomSelectInput/CustomSelectInput"
import { DatagridStyles } from "../common/styles/DatagridStyles"
import { ApplicationListAside } from "./ApplicationListAside"
import { useContext, useState } from "react"
import CatchmentLabel from "../common/components/CatchmentLabel/CatchmentLabel"
import NotifyButton from "../common/components/NotifyButton/NotifyButton"
import { CatchmentContext } from "../common/contexts/CatchmentContext/CatchmentContext"

export const applicationStatusFilters = {
    All: { label: "All" },
    New: { label: "New", status: "Submitted" },
    InProgress: { label: "In Progress", status: "Processing" },
    Completed: { label: "Completed", status: "Completed" },
    Cancelled: { label: "Cancelled", status: "Cancelled" }
} as { [key: string]: any }

export const ApplicationList = (props: any) => {
    const cc = useContext(CatchmentContext)
    const [catchmentName, setCatchmentName] = useState(cc.catchment.name)
    const [listFilter, setListFilter] = useStore("resources.applications.list.listFilter", {
        ...applicationStatusFilters["All"],
        ...{ catchmentno: cc.catchment.id }
    })

    const handleCatchmentSelect = (event) => {
        const catchmentNo = event.target.value

        // Update state in catchment context.
        cc.changeCatchment(catchmentNo)

        // Update list filter with new catchment.
        const statusFilter = applicationStatusFilters[listFilter.label]
        setListFilter({ ...statusFilter, ...{ catchmentno: catchmentNo } })

        // Update catchment label.
        const selection = cc.catchments.find((catchment) => catchment.id === catchmentNo)
        setCatchmentName(selection.name)
    }

    const catchmentSelector = [
        <CustomSelectInput
            source="catchmentno"
            choices={cc.catchments}
            alwaysOn
            label="Select Catchment"
            onChange={handleCatchmentSelect}
            validate={required()}
        />
    ]

    const ListActions = () => (
        <TopToolbar>
            <Box display="flex" alignItems="end">
                <CatchmentLabel catchment={catchmentName} />
                <NotifyButton onClick={() => console.log("notify button clicked")} />
            </Box>
        </TopToolbar>
    )

    return (
        <>
            <List
                {...props}
                actions={<ListActions />}
                filter={listFilter}
                filters={catchmentSelector}
                filterDefaultValues={{ catchmentno: cc.catchment.id }}
                aside={<ApplicationListAside />}
            >
                <Datagrid
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
                    <TextField label="Organization" source="created_by" emptyText="-" />
                    <TextField label="Position Title" source="position_title" emptyText="-" />
                    <FunctionField
                        label="Submitted Date"
                        render={
                            (record: any) =>
                                record.form_submitted_date ? record.form_submitted_date.split("T")[0] : "-" // remove timestamp
                        }
                    />
                    <TextField label="Form Type" source="form_type" emptyText="-" />
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
                </Datagrid>
            </List>
        </>
    )
}
