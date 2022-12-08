import { DoneAll } from "@mui/icons-material"
import CircleIcon from "@mui/icons-material/Circle"
import Button from "@mui/material/Button"
import {
    BooleanInput,
    BulkDeleteButton,
    BulkUpdateButton,
    CreateButton,
    Datagrid,
    FilterButton,
    FunctionField,
    List,
    TextField,
    TopToolbar
} from "react-admin"
const CopyToClipboard = require("react-copy-to-clipboard")

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

const MarkOnICMButton = (props) => <BulkUpdateButton label={props.label} data={{ isInICM: true }} icon={<DoneAll />} />

const FormBulkActionButtons = () => (
    <>
        <MarkOnICMButton label="Mark on ICM" />
        <BulkDeleteButton />
    </>
)

export const ApplicationList = (props: any) => {
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
                            <div>
                                <CircleIcon sx={{ fontSize: 10 }} htmlColor="#47b881" />
                                <div style={{ display: "inline-block", paddingLeft: "0.5vw" }}>Submitted</div>
                            </div>
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
                <FunctionField
                    label="Actions"
                    render={(record: any) =>
                        record.status === null ? (
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
                            <Button
                                href={`${process.env.REACT_APP_DRAFT_URL}${record.applicationid}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                sx={{ textAlign: "center", backgroundColor: "#003366" }}
                            >
                                Continue Application
                            </Button>
                        ) : record.status === "submitted" ? (
                            <Button
                                href={`${process.env.REACT_APP_VIEW_URL}${record.applicationid}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                sx={{ textAlign: "center", backgroundColor: "#003366" }}
                            >
                                View Application
                            </Button>
                        ) : (
                            `N/A`
                        )
                    }
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
