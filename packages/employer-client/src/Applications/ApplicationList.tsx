import {
    BulkDeleteButton,
    CreateButton,
    Datagrid,
    FilterButton,
    FunctionField,
    List,
    TextField,
    TopToolbar,
    useStore
} from "react-admin"
import { Button, Chip } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandshake } from "@fortawesome/pro-solid-svg-icons"
import { ApplicationListAside } from "./ApplicationListAside"

const ListActions = () => (
    <TopToolbar sx={{ paddingTop: "5vh" }}>
        <div>
            {/* <Button
                href={`${process.env.REACT_APP_NEED_EMPLOYEE_URL}&token=${record.internalid}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                sx={{ textAlign: "center", backgroundColor: "#003366" }}
            >
                Fill Out Form
            </Button> */}
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
    NotSubmitted: { label: "Not Submitted", status: "not submitted" },
    Submitted: { label: "Submitted", applicationstatus: "New", status: "submitted" },
    Processing: { label: "Processing", applicationstatus: "In Progress", status: "submitted" },
    Completed: { label: "Completed", applicationstatus: "Completed", status: "submitted" },
    Cancelled: { label: "Cancelled", status: "cancelled" }
} as { [key: string]: any }

export const ApplicationList = (props: any) => {
    const [statusFilter] = useStore("resources.applications.list.statusFilter", applicationStatusFilters.All)

    return (
        <List {...props} actions={<ListActions />} filter={statusFilter} filters={[]} aside={<ApplicationListAside />}>
            <Datagrid
                bulkActionButtons={<FormBulkActionButtons />}
                sx={{
                    "& .column-lock": {
                        padding: "6px 0",
                        "& svg": { verticalAlign: "middle" }
                    },
                    "& .RaDatagrid-rowCell": {
                        textAlign: "center"
                    },
                    "& .RaDatagrid-headerCell": {
                        fontWeight: "bold"
                    }
                }}
                rowClick="show"
            >
                <TextField label="Submission ID" source="id" emptyText="-" textAlign="center" />
                <TextField label="Position Title" source="title" emptyText="-" textAlign="center" />
                <TextField
                    label="Number of Positions"
                    source="numberofpositions0"
                    emptyText="-"
                    textAlign="center"
                />{" "}
                {/* TODO */}
                <TextField label="Submitted Date" source="submitted" emptyText="-" textAlign="center" /> {/* TODO */}
                <TextField label="Shared With" source="sharedwith" emptyText="-" textAlign="center" /> {/* TODO */}
                <FunctionField
                    label=""
                    render={(record: any) => (
                        <Chip
                            label={
                                record.status === "submitted" && record.applicationstatus === "New"
                                    ? "Submitted"
                                    : record.status === "submitted" && record.applicationstatus === "In Progress"
                                    ? "Processing"
                                    : record.status === "submitted" && record.applicationstatus === "Completed"
                                    ? "Completed"
                                    : record.status === "cancelled"
                                    ? "Cancelled"
                                    : "Not Submitted"
                            }
                            size="small"
                            color={
                                record.status === "submitted" && record.applicationstatus === "New"
                                    ? "primary"
                                    : record.status === "submitted" && record.applicationstatus === "In Progress"
                                    ? "warning"
                                    : record.status === "submitted" && record.applicationstatus === "Completed"
                                    ? "success"
                                    : record.status === "cancelled"
                                    ? "error"
                                    : "info"
                            }
                        />
                    )}
                />
                {/* <FunctionField
                    label="Actions"
                    render={(record: any) => {
                        return record.status === "not submitted" ? (
                            <div>
                                <Button
                                    href={`${
                                        record.formtype === "haveEmployee"
                                            ? process.env.REACT_APP_HAVE_EMPLOYEE_URL
                                            : process.env.REACT_APP_NEED_EMPLOYEE_URL
                                    }&token=${record.internalid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="contained"
                                    sx={{ textAlign: "center", backgroundColor: "#003366" }}
                                >
                                    Fill Out Form
                                </Button>
                            </div>
                        ) : record.status === "draft" ? (
                            <>
                                <Button
                                    href={`${process.env.REACT_APP_DRAFT_URL}${record.applicationid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="contained"
                                    sx={{ textAlign: "center", backgroundColor: "#003366" }}
                                >
                                    Continue Application
                                </Button>
                            </>
                        ) : record.status === "submitted" ? (
                            <>
                                <Button
                                    href={`${process.env.REACT_APP_VIEW_URL}${record.applicationid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="contained"
                                    sx={{ textAlign: "center", backgroundColor: "#003366" }}
                                >
                                    View Application
                                </Button>
                            </>
                        ) : (
                            `N/A`
                        )
                    }}
                /> */}
            </Datagrid>
        </List>
    )
}
