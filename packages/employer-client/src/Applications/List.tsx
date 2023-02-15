import { DoneAll } from "@mui/icons-material"
import CircleIcon from "@mui/icons-material/Circle"
import Button from "@mui/material/Button"
import {
    BooleanInput,
    BulkDeleteButton,
    BulkUpdateButton,
    CreateButton,
    Datagrid,
    EditButton,
    FilterButton,
    FunctionField,
    List,
    TextField,
    TopToolbar,
    BooleanField,
    DateField,
    NumberField,
    useRecordContext
} from "react-admin"
import { useKeycloak } from "@react-keycloak/web"
import { CustomShow } from "../Admin/CustomShow"
import { Typography } from "@mui/material"

const formFilters = [
    <BooleanInput
        source="status"
        label="Complete"
        defaultValue={true}
        sx={{ paddingBottom: "20px", paddingLeft: "20px" }}
    />
]

const ListActions = () => (
    <TopToolbar sx={{ paddingTop: "5vh" }}>
        <div>
            <FilterButton />
            <CreateButton />
        </div>
    </TopToolbar>
)

const FormBulkActionButtons = () => (
    <>
        <BulkDeleteButton />
    </>
)

const EditIcon = () => <></>

const FormattedFunctionField = ({ source }: { source: string }) => {
    const record = useRecordContext()
    const re = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/
    if (record[source] === null || !record) {
        return null
    }
    if (typeof record[source] === "number") {
        if (source.includes("wage")) {
            const value = (record[source] / 100).toFixed(2)
            return <Typography variant="body2">${value}</Typography>
        }
        return <NumberField source={source} />
    }
    if (typeof record[source] === "string" && re.test(record[source])) {
        return <DateField source={source} />
    }
    if (typeof record[source] === "string") {
        if (record[source] === "NULL" && source === "applicationstatus") {
            return <Typography variant="body2">New</Typography>
        }
        return <TextField source={source} />
    }
    if (typeof record[source] === "boolean") {
        return <BooleanField source={source} />
    }
    return null
}

export const ApplicationList = (props: any) => {
    const { keycloak } = useKeycloak()
    return (
        <List {...props} actions={<ListActions />} filters={formFilters}>
            <Datagrid bulkActionButtons={<FormBulkActionButtons />}>
                <TextField label="ID" source="id" />
                <FunctionField
                    label="Form Type"
                    render={(record: any) =>
                        record.formtype === "haveEmployee" ? <div>Have Employee</div> : <div>Need Employee</div>
                    }
                />
                <FunctionField
                    label="Status"
                    render={(record: any) =>
                        !record.status ? (
                            <div>
                                <CircleIcon sx={{ fontSize: 10 }} htmlColor="#ec4c47" />
                                <div style={{ display: "inline-block", paddingLeft: "0.5vw" }}>Awaiting Submission</div>
                            </div>
                        ) : record.status === "submitted" ? (
                            <>
                                {record.applicationstatus === "New" ? (
                                    <div>
                                        <CircleIcon sx={{ fontSize: 10 }} htmlColor="#47b881" />
                                        <div style={{ display: "inline-block", paddingLeft: "0.5vw" }}>Submitted</div>
                                    </div>
                                ) : record.applicationstatus === "In Progress" ? (
                                    <div>
                                        <CircleIcon sx={{ fontSize: 10 }} htmlColor="yellow" />
                                        <div style={{ display: "inline-block", paddingLeft: "0.5vw" }}>In Progress</div>
                                    </div>
                                ) : (
                                    <div>
                                        <CircleIcon sx={{ fontSize: 10 }} htmlColor="green" />
                                        <div style={{ display: "inline-block", paddingLeft: "0.5vw" }}>Completed</div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div>
                                <CircleIcon sx={{ fontSize: 10 }} htmlColor="#f7d154" />
                                <div style={{ display: "inline-block", paddingLeft: "0.5vw" }}>In Draft</div>
                            </div>
                        )
                    }
                />
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
                />
                {/*
                <FunctionField
                    label="Enter Details"
                    render={(record: any) => !record.isCreated ?
                        <div>
                            <Button
                                href={`${record.providerUrl.trim()}&token=${record.key}`}
                                target="_blank"
                                rel='noopener noreferrer'
                                variant="contained"
                                sx={{ textAlign: 'center', backgroundColor: '#003366' }}>Fill Out Form
                            </Button>
                        </div>
                        :
                        `N/A`} />
                <FunctionField
                    label="Copy URL"
                    render={(record: any) => !record.isCompleted && record.isCreated ?
                        <CopyToClipboard text={`${record.clientUrl.trim()}&token=${record.key}&lang=${record.language.toLowerCase()}`}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#003366' }}>Copy
                            </Button>
                        </CopyToClipboard>
                        :
                        `N/A`} />
                <FunctionField
                    label="Generate PDF"
                    render={(record: any) => record.isCompleted ?
                        <div>
                            <Button
                                href="#"
                                variant="contained"
                                sx={{ backgroundColor: '#003366' }}
                                onClick={async () => {
                                    const pdfRequest = new Request(`http://localhost:8000/pdf/${record.key}`, {
                                        method: "GET",
                                        headers: new Headers({
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        })
                                    })
                                    try {
                                        const pdf = await fetch(pdfRequest)
                                        .then(response => {
                                            return response.blob()
                                        })
                                        console.log(record)
                                        saveAs(pdf, `${record.formCode}_${record.firstName}_${record.lastName}.pdf`)
                                    } catch (error: any){
                                        console.log(error)
                                        alert("Something happened while generating the PDF")
                                    }
                                }}
                            >
                                Download
                            </Button>
                        </div>
                        :
                        `Not Available`} />
                */}
            </Datagrid>
        </List>
    )
}
