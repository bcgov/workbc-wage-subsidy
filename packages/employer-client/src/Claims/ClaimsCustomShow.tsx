/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/prefer-default-export */
import { Typography } from "@mui/material"
import { ResponsiveStyleValue, Stack, styled, SxProps } from "@mui/system"
import PropTypes from "prop-types"
import { ReactNode } from "react"
import { Labeled, OptionalRecordContextProvider, RaRecord, useRecordContext } from "react-admin"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import type { LabeledProps } from "react-admin"
/*
    a custom view of each claim application modelled to mirror the paper form
    takes in 5 props: className, children, divider, spacing, and rest
    Outputs a formatted view of the claim application with the provided props
*/

export const CustomShow = (props: CustomShowProps) => {
    const { className, children, divider, spacing = 1, ...rest } = props
    const record = useRecordContext(props)
    console.log(record)
    if (!record) {
        return null
    }
    // a custom lebelled component that passes the children to the Labelled component with only the label
    //  being in 14px font size
    const CustomLabeled = (props: LabeledProps) => {
        return (
            <Labeled key={props.key} label={<Typography sx={{ fontSize: "14px" }}>{props.label}</Typography>}>
                {props.children}
            </Labeled>
        )
    }
    return (
        <OptionalRecordContextProvider value={props.record}>
            <Root className={className} {...sanitizeRestProps(rest)}>
                <Stack spacing={spacing} divider={divider} className={SimpleShowLayoutClasses.stack}>
                    <Typography variant="subtitle2">
                        <strong>Attachments</strong>
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="flex-start">
                        {record.files && record.files.files.length > 0 ? (
                            record.files.files.map((file: any) => (
                                <Stack key={file.data.id}>
                                    <InsertDriveFileIcon sx={{ fontSize: 40 }} />
                                    <Typography variant="body2">{file.originalName}</Typography>
                                </Stack>
                            ))
                        ) : (
                            <Typography variant="body2">No Attachments</Typography>
                        )}
                    </Stack>
                    <Typography variant="subtitle2">
                        <strong>WORK EXPERIENCE WAGE SUBSIDY - CLAIM FORM</strong>
                    </Typography>
                    <CustomLabeled key="id" label="ID">
                        <Typography variant="body2">{record.id && record.id.toString()}</Typography>
                    </CustomLabeled>
                    <CustomLabeled key="Title" label="Title">
                        <Typography variant="body2">{record.title}</Typography>
                    </CustomLabeled>
                    <CustomLabeled key="applicationid" label="Application ID">
                        <Typography variant="body2">
                            {record.applicationid ? record.applicationid.toString().substring(0, 8) : ""}
                        </Typography>
                    </CustomLabeled>
                    <CustomLabeled key="applicationstatus" label="Application Status">
                        <Typography variant="body2">
                            {record.applicationstatus && record.applicationstatus.replace("NULL", "New")}
                        </Typography>
                    </CustomLabeled>
                    <CustomLabeled key="created" label="Application Created Date">
                        <Typography variant="body2">
                            {record.created && record.created.toString().substring(0, 10)}
                        </Typography>
                    </CustomLabeled>
                    <Typography variant="subtitle2">
                        <strong>CLAIM FORM DETAILS</strong>
                    </Typography>
                    <CustomLabeled
                        key="catchmentno"
                        label={<Typography sx={{ fontSize: "14px" }}>Catchment Number:</Typography>}
                    >
                        <Typography variant="body2">{record.catchmentno && record.catchmentno.toString()}</Typography>
                    </CustomLabeled>
                    <CustomLabeled
                        key="Periodstart1"
                        label={<Typography sx={{ fontSize: "14px" }}>Period claim covered from:</Typography>}
                    >
                        <Typography variant="body2">
                            {record.periodstart1 && record.periodstart1.toString().substring(0, 10)}
                        </Typography>
                    </CustomLabeled>
                    <CustomLabeled key="Periodstart2" label="Period claim covered to:">
                        <Typography variant="body2">
                            {record.periodstart2 && record.periodstart2.toString().substring(0, 10)}
                        </Typography>
                    </CustomLabeled>
                    <CustomLabeled key="Isfinalclaim" label="Final Claim?">
                        <Typography variant="body2">
                            {record.isfinalclaim && record.isfinalclaim === true ? "Yes" : "No"}
                        </Typography>
                    </CustomLabeled>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Stack>
                            <CustomLabeled key="operatingname" label="Employer/Business Name:">
                                <Typography variant="body2">{record.operatingname}</Typography>
                            </CustomLabeled>
                            <CustomLabeled key="businessphone" label="Business Phone:">
                                <Typography variant="body2">
                                    {record.businessphone && record.businessphone.toString()}
                                </Typography>
                            </CustomLabeled>
                            <CustomLabeled key="businessaddress1" label="Business Address 1:">
                                <Typography variant="body2">
                                    {record.businessaddress1 && record.businessaddress1.toString()}
                                </Typography>
                            </CustomLabeled>
                            <CustomLabeled key="businessaddress2" label="Business Address 2:">
                                <Typography variant="body2">
                                    {record.businessaddress2 && record.businessaddress2.toString()}
                                </Typography>
                            </CustomLabeled>
                        </Stack>
                        <Stack>
                            <CustomLabeled key="" label="Contact Person:">
                                <Typography variant="body2">{record.contactperson}</Typography>
                            </CustomLabeled>
                            <CustomLabeled key="businesscity" label="Business City:">
                                <Typography variant="body2">{record.businesscity}</Typography>
                            </CustomLabeled>
                            <CustomLabeled key="businesspostal" label="Business Postal Code:">
                                <Typography variant="body2">
                                    {record.businesspostal && record.businesspostal.toString()}
                                </Typography>
                            </CustomLabeled>
                        </Stack>
                        <div></div>
                    </Stack>
                    <CustomLabeled key="employeefirstname" label="Employee First Name:">
                        <Typography variant="body2">{record.employeefirstname}</Typography>
                    </CustomLabeled>
                    <CustomLabeled key="employeelastname" label="Employee Last Name:">
                        <Typography variant="body2">{record.employeelastname}</Typography>
                    </CustomLabeled>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Week</TableCell>
                                    <TableCell align="center">Date From</TableCell>
                                    <TableCell align="center">Date To</TableCell>
                                    <TableCell align="center">Hours Worked</TableCell>
                                    <TableCell align="center">Hourly Wage</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow key="1" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        1
                                    </TableCell>
                                    <TableCell align="center">
                                        {record.datefrom1 && record.datefrom1.toString().substring(0, 10)}
                                    </TableCell>
                                    <TableCell align="center">
                                        {record.dateto1 && record.dateto1.toString().substring(0, 10)}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.hoursworked1 && (Number(record.hoursworked1) / 100).toString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.hourlywage1 && (Number(record.hourlywage1) / 100).toString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.totalwage1 && (Number(record.totalwage1) / 100).toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="2" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        2
                                    </TableCell>
                                    <TableCell align="center">
                                        {record.datefrom2 && record.datefrom2.toString().substring(0, 10)}
                                    </TableCell>
                                    <TableCell align="center">
                                        {record.dateto2 && record.dateto2.toString().substring(0, 10)}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.hoursworked2 && (Number(record.hoursworked2) / 100).toString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.hourlywage2 && (Number(record.hourlywage2) / 100).toString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.totalwage2 && (Number(record.totalwage2) / 100).toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="3" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        3
                                    </TableCell>
                                    <TableCell align="center">
                                        {record.datefrom3 && record.datefrom3.toString().substring(0, 10)}
                                    </TableCell>
                                    <TableCell align="center">
                                        {record.dateto3 && record.dateto3.toString().substring(0, 10)}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.hoursworked3 && (Number(record.hoursworked3) / 100).toString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.hourlywage3 && (Number(record.hourlywage3) / 100).toString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.totalwage3 && (Number(record.totalwage3) / 100).toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="4" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        4
                                    </TableCell>
                                    <TableCell align="center">
                                        {record.datefrom4 && record.datefrom4.toString().substring(0, 10)}
                                    </TableCell>
                                    <TableCell align="center">
                                        {record.dateto4 && record.dateto4.toString().substring(0, 10)}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.hoursworked4 && (Number(record.hoursworked4) / 100).toString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.hourlywage4 && (Number(record.hourlywage4) / 100).toString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.totalwage4 && (Number(record.totalwage4) / 100).toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="5" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        5
                                    </TableCell>
                                    <TableCell align="center">
                                        {record.datefrom5 && record.datefrom5.toString().substring(0, 10)}
                                    </TableCell>
                                    <TableCell align="center">
                                        {record.dateto5 && record.dateto5.toString().substring(0, 10)}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.hoursworked5 && (Number(record.hoursworked5) / 100).toString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.hourlywage5 && (Number(record.hourlywage5) / 100).toString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.totalwage5 && (Number(record.totalwage5) / 100).toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="MERCS" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell colSpan={5} align="left">
                                        Total employer Portion of MERCs:
                                    </TableCell>
                                    <TableCell align="center">
                                        ${record.totalmercs1 && record.totalmercs1.toString()}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <CustomLabeled
                        key="workactivitiesandissues"
                        label="Summary of the job activities, employee’s progress and any issues:"
                    >
                        <Typography variant="body2">{record.workactivitiesandissues}</Typography>
                    </CustomLabeled>
                    <Typography variant="subtitle2">
                        <strong>ONLINE CLAIM CALCULATOR</strong>
                    </Typography>
                    <CustomLabeled key="eligiblewages" label="Eligible this claim:">
                        <Typography variant="body2">{record.eligiblewages}</Typography>
                    </CustomLabeled>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" colSpan={2}>
                                        Date From
                                    </TableCell>
                                    <TableCell align="center" colSpan={2}>
                                        Date To
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow key="1" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="left">Subsidy Rate Date From:</TableCell>
                                    <TableCell align="center">
                                        {record.subsidyratedatefrom1
                                            ? record.subsidyratedatefrom1.toString().substring(0, 10)
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell align="left">Subsidy Rate Date From:</TableCell>
                                    <TableCell align="center" sx={{ minWidth: "25%" }}>
                                        {record.subsidyratedatefrom2
                                            ? record.subsidyratedatefrom2.toString().substring(0, 10)
                                            : "N/A"}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="2" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="left">Subsidy Rate Date To:</TableCell>
                                    <TableCell align="center">
                                        {record.subsidyratedateto1
                                            ? record.subsidyratedateto1.toString().substring(0, 10)
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell align="left">Subsidy Rate Date To:</TableCell>
                                    <TableCell align="center">
                                        {record.subsidyratedateto2
                                            ? record.subsidyratedateto2.toString().substring(0, 10)
                                            : "N/A"}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="3" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="left">Total Weeks</TableCell>
                                    <TableCell align="center">
                                        {record.totalweeks1 && record.totalweeks1.toString()}
                                    </TableCell>
                                    <TableCell align="left">Total Weeks</TableCell>
                                    <TableCell align="center">
                                        {record.totalweeks2 && record.totalweeks2.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="4" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="left">Subsidy Rate Percent</TableCell>
                                    <TableCell align="center">
                                        {record.subsidyratepercent1 && record.subsidyratepercent1.toString()}%
                                    </TableCell>
                                    <TableCell align="left">Subsidy Rate Percent</TableCell>
                                    <TableCell align="center">
                                        {record.subsidyratepercent2 && record.subsidyratepercent2.toString()}%
                                    </TableCell>
                                </TableRow>
                                <TableRow key="5" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="left">Total Wages Paid</TableCell>
                                    <TableCell align="center">
                                        ${record.totalwage1 && (Number(record.totalwage1) / 100).toString()}
                                    </TableCell>
                                    <TableCell align="left">Total Wages Paid</TableCell>
                                    <TableCell align="center">
                                        ${record.totalwage2 && (Number(record.totalwage2) / 100).toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="6" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="left">Eligible Wages</TableCell>
                                    <TableCell align="center">
                                        ${record.eligiblewages && record.eligiblewages.toString()}
                                    </TableCell>
                                    <TableCell align="left">Eligible Wages</TableCell>
                                    <TableCell align="center">
                                        ${record.eligiblewages2 && record.eligiblewages2.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="7" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="left">Wages Reimbursed</TableCell>
                                    <TableCell align="center">
                                        ${record.wagesreimbursed1 && record.wagesreimbursed1.toString()}
                                    </TableCell>
                                    <TableCell align="left">Wages Reimbursed</TableCell>
                                    <TableCell align="center">
                                        ${record.wagesreimbursed2 && record.wagesreimbursed2.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="8" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="left">Total MERCs paid</TableCell>
                                    <TableCell align="center">
                                        ${record.totalmercs1 && record.totalmercs1.toString()}
                                    </TableCell>
                                    <TableCell align="left">Total MERCs paid</TableCell>
                                    <TableCell align="center">
                                        ${record.totalmercs2 && record.totalmercs2.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="9" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="left">MERCs Reimbursed</TableCell>
                                    <TableCell align="center">
                                        ${record.mercsreimbursed1 && record.mercsreimbursed1.toString()}
                                    </TableCell>
                                    <TableCell align="left">MERCs Reimbursed</TableCell>
                                    <TableCell align="center">
                                        ${record.mercsreimbursed2 && record.mercsreimbursed2.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="10" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="left">Total Reimbursed</TableCell>
                                    <TableCell align="center">
                                        ${record.totalamountreimbursed1 && record.totalamountreimbursed1.toString()}
                                    </TableCell>
                                    <TableCell align="left">Total Reimbursed</TableCell>
                                    <TableCell align="center">
                                        ${record.totalamountreimbursed2 && record.totalamountreimbursed2.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="11" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="left">Total Subsidy Claimed</TableCell>
                                    <TableCell align="right" colSpan={3}>
                                        ${record.totalsubsidyclaimed && record.totalsubsidyclaimed.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="12" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="left">Claim Approved By</TableCell>
                                    <TableCell align="right" colSpan={3}>
                                        {record.claimapprovedby1 && record.claimapprovedby1.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="13" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="left">Claim Verified Date</TableCell>
                                    <TableCell align="right" colSpan={3}>
                                        {record.claimverifieddate &&
                                            record.claimverifieddate.toString().substring(0, 10)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </Root>
        </OptionalRecordContextProvider>
    )
}

export interface CustomShowProps {
    children: ReactNode
    className?: string
    divider?: ReactNode
    record?: RaRecord
    spacing?: ResponsiveStyleValue<number | string>
    sx?: SxProps
}

CustomShow.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    divider: PropTypes.any,
    record: PropTypes.object,
    spacing: PropTypes.any,
    sx: PropTypes.any
}

const PREFIX = "RaSimpleShowLayout"

export const SimpleShowLayoutClasses = {
    stack: `${PREFIX}-stack`,
    row: `${PREFIX}-row`
}

const Root = styled("div", {
    name: PREFIX,
    overridesResolver: (props: any, styles: any) => styles.root
})(({ theme }) => ({
    flex: 1,
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    [`& .${SimpleShowLayoutClasses.stack}`]: {},
    [`& .${SimpleShowLayoutClasses.row}`]: {
        display: "inline"
    }
}))

const sanitizeRestProps = ({ record, resource, initialValues, translate, ...rest }: any) => rest
