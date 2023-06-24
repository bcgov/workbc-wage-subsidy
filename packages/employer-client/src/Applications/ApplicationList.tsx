import {
    BulkDeleteButton,
    CreateButton,
    Datagrid,
    FilterButton,
    FunctionField,
    List,
    TextField,
    TopToolbar,
    useStore,
    RowClickFunction,
    Identifier
} from "react-admin"
import { Button, Chip } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandshake } from "@fortawesome/pro-solid-svg-icons"
import { ApplicationListAside } from "./ApplicationListAside"

const ListActions = () => (
    <TopToolbar sx={{ paddingTop: "5vh" }}>
        <div>
            <CreateButton label="New Application" />
        </div>
    </TopToolbar>
)

const FormBulkActionButtons = () => (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", cursor: "pointer" }}>
        <FontAwesomeIcon icon={faHandshake} style={{ marginRight: 10 }} />
        SHARE
    </div>
)

export const applicationStatusFilters = {
    All: { label: "All" },
    NotSubmitted: { label: "Draft", status: "Draft" },
    Submitted: { label: "Submitted", status: "Submitted" },
    Processing: { label: "Processing", status: "Processing" },
    Completed: { label: "Completed", status: "Completed" },
    Cancelled: { label: "Cancelled", status: "Cancelled" }
} as { [key: string]: any }

export const ApplicationList = (props: any) => {
    const [statusFilter] = useStore("resources.applications.list.statusFilter", applicationStatusFilters.All)

    return (
        <List {...props} actions={<ListActions />} filter={statusFilter} filters={[]} aside={<ApplicationListAside />}>
            <Datagrid
                bulkActionButtons={<FormBulkActionButtons />}
                sx={{
                    cursor: "pointer",
                    "& .column-lock": {
                        padding: "6px 0",
                        "& svg": { verticalAlign: "middle" }
                    },
                    "& .RaDatagrid-rowCell": {
                        textAlign: "left"
                    },
                    "& .RaDatagrid-headerCell": {
                        fontWeight: "bold",
                        textAlign: "left"
                    }
                }}
                rowClick={(id: Identifier, resource: string, record: any) => {
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
                <TextField label="Number of Positions" source="num_positions" emptyText="-" />{" "}
                <FunctionField
                    label="Submitted Date"
                    render={(record: any) =>
                        record.form_submitted_date ? record.form_submitted_date.split("T")[0] : "-" // remove timestamp
                    }
                />
                <TextField label="Shared With" source="shared_with" emptyText="-" /> {/* TODO */}
                <FunctionField
                    label=""
                    render={(record: any) => (
                        <Chip
                            label={record.status}
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
                    )}
                />
            </Datagrid>
        </List>
    )
}
