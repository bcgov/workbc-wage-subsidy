/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/prefer-default-export */
import { Check, Delete } from "@mui/icons-material"
import { Box, Button, CircularProgress, Modal, Typography } from "@mui/material"
import PendingIcon from "@mui/icons-material/Pending"
import InputIcon from "@mui/icons-material/Input"
import { useKeycloak } from "@react-keycloak/web"
import { saveAs } from "file-saver"
import React from "react"
import {
    BooleanField,
    BulkUpdateButton,
    CheckboxGroupInput,
    Datagrid,
    DateField,
    EditButton,
    FilterButton,
    FunctionField,
    List,
    NumberField,
    Pagination,
    SearchInput,
    SelectInput,
    TextField,
    TopToolbar,
    useRecordContext
} from "react-admin"
import { CustomShow } from "./WageCustomShow"

const FormattedFunctionField = ({ source }: any) => {
    const record = useRecordContext()
    const re = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/
    console.log(record[source])
    if (record[source] === null || !record) {
        return null
    }
    if (source === "applicationid") {
        return (
            <Typography variant="body2">
                {record[source].toString().length > 10 ? record[source].toString().substring(0, 8) : record[source]}
            </Typography>
        )
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

const PostShow = (...props: any) => (
    <CustomShow>
        <FormattedFunctionField source="id" />
        <FormattedFunctionField source="title" />
        <FormattedFunctionField source="catchmentno" />
        <FormattedFunctionField source="formtype" />
        <FormattedFunctionField source="applicationid" />
        <FormattedFunctionField source="applicationstatus" />
        <FormattedFunctionField source="operatingname" />
        <FormattedFunctionField source="businessnumber" />
        <FormattedFunctionField source="businessaddress1" />
        <FormattedFunctionField source="businesscity" />
        <FormattedFunctionField source="businessprovince" />
        <FormattedFunctionField source="businesspostal" />
        <FormattedFunctionField source="businessphone" />
        <FormattedFunctionField source="businessfax" />
        <FormattedFunctionField source="businessemail" />
        <FormattedFunctionField source="otherworkaddress" />
        <FormattedFunctionField source="sectortype" />
        <FormattedFunctionField source="typeofindustry" />
        <FormattedFunctionField source="organizationsize" />
        <FormattedFunctionField source="cewsandorcrhp" />
        <FormattedFunctionField source="employeedisplacement" />
        <FormattedFunctionField source="labourdispute" />
        <FormattedFunctionField source="unionconcurrence" />
        <FormattedFunctionField source="liabilitycoverage" />
        <FormattedFunctionField source="wagesubsidy" />
        <FormattedFunctionField source="wsbccoverage" />
        <FormattedFunctionField source="lawcomplianceconsent" />
        <FormattedFunctionField source="orgeligibilityconsent" />
        <FormattedFunctionField source="wsbcnumber" />
        <FormattedFunctionField source="addressalt" />
        <FormattedFunctionField source="cityalt" />
        <FormattedFunctionField source="provincealt" />
        <FormattedFunctionField source="postalalt" />
        <FormattedFunctionField source="participantemail0" />
        <FormattedFunctionField source="participantemail1" />
        <FormattedFunctionField source="participantemail2" />
        <FormattedFunctionField source="participantemail3" />
        <FormattedFunctionField source="participantemail4" />
        <FormattedFunctionField source="positiontitle0" />
        <FormattedFunctionField source="numberofpositions0" />
        <FormattedFunctionField source="startdate0" />
        <FormattedFunctionField source="hours0" />
        <FormattedFunctionField source="wage0" />
        <FormattedFunctionField source="applicationmercs0" />
        <FormattedFunctionField source="duties0" />
        <FormattedFunctionField source="skills0" />
        <FormattedFunctionField source="workexperience0" />
        <FormattedFunctionField source="positiontitle1" />
        <FormattedFunctionField source="numberofpositions1" />
        <FormattedFunctionField source="startdate1" />
        <FormattedFunctionField source="hours1" />
        <FormattedFunctionField source="wage1" />
        <FormattedFunctionField source="applicationmercs1" />
        <FormattedFunctionField source="duties1" />
        <FormattedFunctionField source="skills1" />
        <FormattedFunctionField source="workexperience1" />
        <FormattedFunctionField source="signatory1" />
        <FormattedFunctionField source="organizationconsent" />
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

// eslint-disable-next-line prefer-const
let choices: any[] | undefined = []
if (localStorage.getItem("provider") === "BCEID") {
    localStorage
        .getItem("permissions")
        ?.split(",")
        .map((x: string) => parseInt(x, 10))
        .forEach((x: number) => {
            // if not a number then do not push
            if (x) {
                choices?.push({ id: x, name: `${x}` })
            }
        })
} else if (localStorage.getItem("provider") === "IDIR" && localStorage.getItem("access") === "true") {
    for (let i = 1; i <= 45; i += 1) {
        choices?.push({ id: i, name: `${i}` })
    }
}
console.log(choices)

const formFilters = [
    <SelectInput key="caFilter" source="catchmentno" label="Catchment" choices={choices} emptyText="All" alwaysOn />,
    <CheckboxGroupInput
        key="statusFilter"
        source="applicationstatus"
        label=""
        choices={[
            { id: "NULL", name: "New", defaultChecked: true },
            { id: "In Progress", name: "In Progress", defaultChecked: true },
            { id: "Completed", name: "Completed" },
            { id: "Cancelled", name: "Cancelled" },
            { id: "Marked for Deletion", name: "Marked for Deletion" },
            { id: "In ICM", name: "In ICM" }
        ]}
        alwaysOn
    />,
    <CheckboxGroupInput
        key="statusFilter"
        source="status"
        label=""
        choices={[{ id: "NULL", name: "Legacy" }]}
        alwaysOn
    />,
    <SearchInput key="searchID" placeholder="Search ID" source="id" />,
    <SearchInput key="searchApplicationId" placeholder="Search Application ID" source="applicationid" />,
    <SearchInput key="title" source="title" placeholder="Search Title" alwaysOn />
]

const ListActions = () => (
    <TopToolbar>
        <FilterButton />
    </TopToolbar>
)
const EditIcon = () => <></>

const MarkCompletedButton = () => (
    <BulkUpdateButton
        label="Mark as Completed"
        data={{
            applicationstatus: "Completed"
        }}
        icon={<Check />}
    />
)

const MarkInProgressButton = () => (
    <BulkUpdateButton
        label="Mark as In Progress"
        data={{
            applicationstatus: "In Progress"
        }}
        icon={<PendingIcon />}
    />
)

const MarkForDeletionButton = () => (
    <BulkUpdateButton
        label="Mark for Deletion"
        data={{
            applicationstatus: "Marked for Deletion"
        }}
        icon={<Delete />}
        sx={{ color: "red" }}
    />
)

const MarkInICMButton = () => (
    <BulkUpdateButton
        label="In ICM"
        data={{
            applicationstatus: "In ICM"
        }}
        icon={<InputIcon />}
    />
)

const WagesBulkActionButtons = () => {
    const keycloak = useKeycloak()
    return (
        <>
            <MarkCompletedButton />
            <MarkInProgressButton />
            {/* default bulk delete action */}
            {keycloak.keycloak.tokenParsed?.identity_provider === "idir" && (
                <>
                    <MarkInICMButton />
                    <MarkForDeletionButton />
                </>
            )}
        </>
    )
}

const PostPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    p: 4
}

export const WageList = (props: any) => {
    const keycloak = useKeycloak()
    const [open, setOpen] = React.useState(false)
    const [modalText, setModalText] = React.useState("")
    // On every open, set the text in modal to empty to allow for the spinner to appear
    const handleOpen = () => {
        setModalText("")
        setOpen(true)
    }
    const handleClose = () => setOpen(false)
    return (
        <List empty={false} {...props} actions={<ListActions />} filters={formFilters} pagination={<PostPagination />}>
            {/* Code for the PDF-saving modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Generating PDF...
                    </Typography>
                    <Box sx={{ display: "flex" }}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {modalText === "" ? <CircularProgress /> : modalText}
                        </Typography>
                    </Box>
                </Box>
            </Modal>
            {/* Data code */}
            <Datagrid expand={<PostShow {...props} />} bulkActionButtons={<WagesBulkActionButtons />}>
                <TextField source="id" />
                <NumberField source="catchmentno" label="CA" />
                <DateField source="created" />
                <FormattedFunctionField source="applicationid" />
                <TextField source="title" />
                <FormattedFunctionField source="applicationstatus" label="SP Application Status" />
                <TextField source="status" label="Employer Appplication Status" />
                <FunctionField
                    label="Actions"
                    render={(record: any) => (
                        <div>
                            <Button
                                href="#"
                                variant="contained"
                                sx={{ backgroundColor: "#003366" }}
                                onClick={async (e) => {
                                    e.preventDefault()
                                    handleOpen()
                                    // notify("Downloading PDF...", { autoHideDuration: 0 })
                                    const pdfRequest = new Request(
                                        `${process.env.REACT_APP_ADMIN_API_URL || "http://localhost:8002"}/wage/pdf/${
                                            record.id
                                        }`,
                                        {
                                            method: "GET",
                                            headers: new Headers({
                                                Authorization: `Bearer ${localStorage.getItem("token")}`
                                            })
                                        }
                                    )
                                    try {
                                        // Helper function to fetch with a specified timeout
                                        // Use for long and big PDFs
                                        const fetchWithTimeout = async (
                                            resource: Request,
                                            options: { timeout: number }
                                        ) => {
                                            const { timeout = 60000 } = options

                                            const controller = new AbortController()
                                            const id = setTimeout(() => controller.abort(), timeout)
                                            const response = await fetch(resource, {
                                                ...options,
                                                signal: controller.signal
                                            })
                                            clearTimeout(id)
                                            return response
                                        }
                                        //execute pull PDF then change the text in modal to PDF Downloaded
                                        const pdf = await fetchWithTimeout(pdfRequest, { timeout: 60000 }).then(
                                            (response) => {
                                                setModalText("PDF Downloaded")
                                                return response.blob()
                                            }
                                        )
                                        console.log(record)
                                        // save then close the modal
                                        saveAs(
                                            pdf,
                                            `${
                                                record.confirmationid ? record.confirmationid : record.applicationid
                                            }.pdf`
                                        )
                                        setTimeout(() => {
                                            handleClose()
                                        }, 3000)
                                        // notify("PDF Downloaded", { type: "success" })
                                        /*
                                        console.log(pdf)
                                        const url = window.URL.createObjectURL(pdf);
                                        const a = document.createElement('a');
                                        a.style.display = 'none';
                                        a.href = url;
                                        // the filename you want
                                        a.download = `pdf`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        window.URL.revokeObjectURL(url);
                                        */
                                        // return pdf
                                    } catch (error: any) {
                                        console.log(error)
                                        setModalText("Error Downloading PDF")
                                        setTimeout(() => {
                                            handleClose()
                                        }, 5000)
                                        // notify(`Error: ${error}`, { type: "error" })
                                    }
                                }}
                            >
                                Download as PDF
                            </Button>
                            {keycloak.keycloak.tokenParsed?.identity_provider === "idir" && (
                                <EditButton
                                    variant="contained"
                                    sx={{ backgroundColor: "#003366", margin: "5px" }}
                                    label="Change Catchment/Shared With"
                                    icon={<EditIcon />}
                                />
                            )}
                        </div>
                    )}
                />
            </Datagrid>
        </List>
    )
}
