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
import { Chip } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandshake } from "@fortawesome/pro-solid-svg-icons"
import { ApplicationListAside } from "./ApplicationListAside"

const ListActions = () => (
    <TopToolbar sx={{ paddingTop: "5vh" }}>
        <div>
            <FilterButton />
            <CreateButton
                label="New Application"
                sx={{
                    color: "#fff",
                    backgroundColor: "#003366",
                    marginBottom: 2
                }}
            />
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
    NotSubmitted: { label: "Not Submitted", applicationstatus: null },
    InProgress: { label: "In Progress", applicationstatus: "In Progress" },
    Completed: { label: "Completed", applicationstatus: "Completed" },
    Cancelled: { label: "Cancelled", applicationstatus: "Cancelled" }
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
                    }
                }}
                rowClick="show"
            >
                <TextField label="Submission ID" source="applicationid" emptyText="-" textAlign="center" />
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
                    render={
                        (record: any) => (
                            <Chip
                                label={record.status ?? "Not Submitted"}
                                size="small"
                                color={
                                    record.status === "New"
                                        ? "primary"
                                        : record.status === "In Progress"
                                        ? "secondary"
                                        : record.status === "Submitted"
                                        ? "success"
                                        : "info"
                                }
                            />
                        )

                        // record.status === "submitted" ? (
                        //     <>
                        //         {record.applicationstatus === "New" ? (
                        //             <div>
                        //                 <CircleIcon sx={{ fontSize: 10 }} htmlColor="#47b881" />
                        //                 <div style={{ display: "inline-block", paddingLeft: "0.5vw" }}>Submitted</div>
                        //             </div>
                        //         ) : record.applicationstatus === "In Progress" ? (
                        //             <div>
                        //                 <CircleIcon sx={{ fontSize: 10 }} htmlColor="yellow" />
                        //                 <div style={{ display: "inline-block", paddingLeft: "0.5vw" }}>In Progress</div>
                        //             </div>
                        //         ) : (
                        //             <div>
                        //                 <CircleIcon sx={{ fontSize: 10 }} htmlColor="green" />
                        //                 <div style={{ display: "inline-block", paddingLeft: "0.5vw" }}>Completed</div>
                        //             </div>
                        //         )}
                        //     </>
                        // ) : (
                        //     <div>
                        //         <CircleIcon sx={{ fontSize: 10 }} htmlColor="#f7d154" />
                        //         <div style={{ display: "inline-block", paddingLeft: "0.5vw" }}>In Draft</div>
                        //     </div>
                        // )
                    }
                />
                {/*
                <FunctionField
                    label="Confirmation ID"
                    render={(record: any) =>
                        record.confirmationid === null ? <div>N/A</div> : <div>{record.confirmationid}</div>
                    }
                />
                <FunctionField label="Owner" render={(record: any) => <div>{record.createdby}</div>} />
                <FunctionField
                    label="BCeIDs Shared With"
                    render={(record: any) =>
                        record.sharedwith === "" ? <div>N/A</div> : <div>{record.sharedwith}</div>
                    }
                />
                <FunctionField
                    label="Actions"
                    render={(record: any) => {
                        if (keycloak.idTokenParsed?.bceid_username !== record.createdby) {
                            return <>N/A</>
                        }
                        return record.status === null ? (
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
                                {keycloak.idTokenParsed?.bceid_username === record.createdby && (
                                    <EditButton
                                        icon={(<EditIcon />) as React.ReactElement<any>}
                                        label="Share"
                                        sx={{
                                            textAlign: "center",
                                            backgroundColor: "#003366",
                                            color: "white",
                                            padding: "6px 16px 6px",
                                            width: "auto",
                                            height: "36.5px",
                                            fontSize: "14px",
                                            minWidth: "64px",
                                            margin: "5px",
                                            ":hover": { background: "#1976d2" }
                                        }}
                                    />
                                )}
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
