import { DoneAll } from "@mui/icons-material"
import CircleIcon from "@mui/icons-material/Circle"
import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import { useKeycloak } from "@react-keycloak/web"
import {
    BooleanField,
    BooleanInput,
    BulkDeleteButton,
    BulkUpdateButton,
    CreateButton,
    Datagrid,
    DateField,
    EditButton,
    FilterButton,
    FunctionField,
    List,
    NumberField,
    TextField,
    TopToolbar,
    useRecordContext
} from "react-admin"
import { CustomShow } from "./ClaimsCustomShow"

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

const FormattedFunctionField = ({ source }: any) => {
    const record = useRecordContext()
    const re = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/
    console.log(record[source])
    if (source === "applicationid") {
        return (
            <Typography variant="body2">
                {record[source] && record[source].toString().length > 8 && record[source].toString().substring(0, 8)}
            </Typography>
        )
    }
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

const EditIcon = () => <></>

const PostShow = (...props: any) => (
    <CustomShow>
        <FormattedFunctionField source="id" />
        <FormattedFunctionField source="title" />
        <FormattedFunctionField source="catchmentno" />
        <FormattedFunctionField source="formtype" />
        <FormattedFunctionField source="applicationid" />
        <FormattedFunctionField source="applicationstatus" />
        <FormattedFunctionField source="periodstart1" />
        <FormattedFunctionField source="periodstart2" />
        <FormattedFunctionField source="isfinalclaim" />
        <FormattedFunctionField source="operatingname" />
        <FormattedFunctionField source="businessaddress1" />
        <FormattedFunctionField source="businesscity" />
        <FormattedFunctionField source="businesspostal" />
        <FormattedFunctionField source="businessphone" />
        <FormattedFunctionField source="employeefirstname" />
        <FormattedFunctionField source="employeelastname" />
        <FormattedFunctionField source="datefrom1" />
        <FormattedFunctionField source="datefrom2" />
        <FormattedFunctionField source="datefrom3" />
        <FormattedFunctionField source="datefrom4" />
        <FormattedFunctionField source="datefrom5" />
        <FormattedFunctionField source="dateto1" />
        <FormattedFunctionField source="dateto2" />
        <FormattedFunctionField source="dateto3" />
        <FormattedFunctionField source="dateto4" />
        <FormattedFunctionField source="dateto5" />
        <FormattedFunctionField source="hoursworked1" />
        <FormattedFunctionField source="hoursworked2" />
        <FormattedFunctionField source="hoursworked3" />
        <FormattedFunctionField source="hoursworked4" />
        <FormattedFunctionField source="hoursworked5" />
        <FormattedFunctionField source="hourlywage1" />
        <FormattedFunctionField source="hourlywage2" />
        <FormattedFunctionField source="hourlywage3" />
        <FormattedFunctionField source="hourlywage4" />
        <FormattedFunctionField source="hourlywage5" />
        <FormattedFunctionField source="workactivitiesandissues" />
        <FormattedFunctionField source="totalwage1" />
        <FormattedFunctionField source="totalwage2" />
        <FormattedFunctionField source="totalwage3" />
        <FormattedFunctionField source="totalwage4" />
        <FormattedFunctionField source="totalwage5" />
        <FormattedFunctionField source="eligiblewages" />
        <FormattedFunctionField source="eligiblewages2" />
        <FormattedFunctionField source="totalmercs1" />
        <FormattedFunctionField source="totalmercs2" />
        <FormattedFunctionField source="subsidyratepercent1" />
        <FormattedFunctionField source="subsidyratepercent2" />
        <FormattedFunctionField source="subsidyratedatefrom1" />
        <FormattedFunctionField source="subsidyratedateto1" />
        <FormattedFunctionField source="totalamountreimbursed1" />
        <FormattedFunctionField source="claimapprovedby1" />
        <FormattedFunctionField source="subsidyratedatefrom2" />
        <FormattedFunctionField source="subsidyratedateto2" />
        <FormattedFunctionField source="totalamountreimbursed2" />
        <FormattedFunctionField source="claimapprovedby2" />
        <FormattedFunctionField source="claimverifieddate" />
        <FormattedFunctionField source="totalsubsidyclaimed" />
        <FormattedFunctionField source="totalweeks1" />
        <FormattedFunctionField source="totalweeks2" />
        <FormattedFunctionField source="wagesreimbursed1" />
        <FormattedFunctionField source="wagesreimbursed2" />
        <FormattedFunctionField source="mercsreimbursed1" />
        <FormattedFunctionField source="mercsreimbursed2" />
        <FormattedFunctionField source="claimemployeeinfo" />
        <FormattedFunctionField source="originalapplicationid" />
        <FormattedFunctionField source="history" />
        <FormattedFunctionField source="sf" />
        <FormattedFunctionField source="centrename" />
        <FormattedFunctionField source="markedfordeletion" />
        <FormattedFunctionField source="internalid" />
        <FormattedFunctionField source="modified" />
        <FormattedFunctionField source="created" showDate showTime />
        <FormattedFunctionField source="status" />
        <FormattedFunctionField source="createdby" />
        <FormattedFunctionField source="createdbyguid" />
        <FormattedFunctionField source="confirmationid" />
    </CustomShow>
)

export const ClaimList = (props: any) => {
    const { keycloak } = useKeycloak()
    return (
        <List {...props} actions={<ListActions />} filters={formFilters} empty={false}>
            <Datagrid expand={<PostShow {...props} />} bulkActionButtons={<FormBulkActionButtons />}>
                <TextField label="ID" source="id" />
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
                                    href={`${process.env.REACT_APP_CLAIM_URL}&token=${record.internalid}`}
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
