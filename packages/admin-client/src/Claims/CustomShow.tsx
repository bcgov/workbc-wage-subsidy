/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/prefer-default-export */
import { Typography } from "@mui/material"
import { minWidth, ResponsiveStyleValue, Stack, styled, SxProps } from "@mui/system"
import clsx from "clsx"
import PropTypes from "prop-types"
import { Children, isValidElement, ReactNode } from "react"
import { Labeled, OptionalRecordContextProvider, RaRecord, useRecordContext } from "react-admin"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

export const CustomShow = (props: CustomShowProps) => {
    const { className, children, divider, spacing = 1, ...rest } = props
    const record = useRecordContext(props)
    console.log(record)
    if (!record) {
        return null
    }
    return (
        <OptionalRecordContextProvider value={props.record}>
            <Root className={className} {...sanitizeRestProps(rest)}>
                <Stack spacing={spacing} divider={divider} className={SimpleShowLayoutClasses.stack}>
                    <Typography variant="subtitle2">
                        <strong>WORK EXPERIENCE WAGE SUBSIDY - CLAIM FORM</strong>
                    </Typography>
                    <Labeled key="id" label="ID">
                        <Typography variant="body2">{record.id && record.id.toString()}</Typography>
                    </Labeled>
                    <Labeled key="Title" label="Title">
                        <Typography variant="body2">{record.title && record.title}</Typography>
                    </Labeled>
                    <Labeled key="applicationid" label="Application ID">
                        <Typography variant="body2">
                            {record.applicationid ? record.applicationid.toString().substring(0, 8) : ""}
                        </Typography>
                    </Labeled>
                    <Labeled key="applicationstatus" label="Application Status">
                        <Typography variant="body2">
                            {record.applicationstatus && record.applicationstatus.replace("NULL", "New")}
                        </Typography>
                    </Labeled>
                    <Labeled key="created" label="Application Created Date">
                        <Typography variant="body2">
                            {record.created && record.created.toString().substring(0, 10)}
                        </Typography>
                    </Labeled>
                    <Typography variant="subtitle2">
                        <strong>CLAIM FORM DETAILS</strong>
                    </Typography>
                    <Labeled key="catchmentno" label="Catchment">
                        <Typography variant="body2">{record.catchmentno && record.catchmentno.toString()}</Typography>
                    </Labeled>
                    <Labeled key="Periodstart1" label="Period claim covered from:">
                        <Typography variant="body2">
                            {record.periodstart1 && record.periodstart1.toString().substring(0, 10)}
                        </Typography>
                    </Labeled>
                    <Labeled key="Periodstart2" label="Period claim covered to:">
                        <Typography variant="body2">
                            {record.periodstart2 && record.periodstart2.toString().substring(0, 10)}
                        </Typography>
                    </Labeled>
                    <Labeled key="Isfinalclaim" label="Final Claim?">
                        <Typography variant="body2">
                            {record.isfinalclaim && record.isfinalclaim === true ? "Yes" : "No"}
                        </Typography>
                    </Labeled>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Stack>
                            <Labeled key="operatingname" label="Employer/Business Name:">
                                <Typography variant="body2">{record.operatingname && record.operatingname}</Typography>
                            </Labeled>
                            <Labeled key="businessphone" label="Business Phone:">
                                <Typography variant="body2">
                                    {record.businessphone && record.businessphone.toString()}
                                </Typography>
                            </Labeled>
                            <Labeled key="businessaddress1" label="Business Address 1:">
                                <Typography variant="body2">
                                    {record.businessaddress1 && record.businessaddress1.toString()}
                                </Typography>
                            </Labeled>
                            <Labeled key="businessaddress2" label="Business Address 2:">
                                <Typography variant="body2">
                                    {record.businessaddress2 && record.businessaddress2.toString()}
                                </Typography>
                            </Labeled>
                        </Stack>
                        <Stack>
                            <Labeled key="" label="Contact Person:">
                                <Typography variant="body2">{record.contactperson && record.contactperson}</Typography>
                            </Labeled>
                            <Labeled key="businesscity" label="Business City:">
                                <Typography variant="body2">{record.businesscity && record.businesscity}</Typography>
                            </Labeled>
                            <Labeled key="businesspostal" label="Business Postal Code:">
                                <Typography variant="body2">
                                    {record.businesspostal && record.businesspostal.toString()}
                                </Typography>
                            </Labeled>
                        </Stack>
                        <div></div>
                    </Stack>
                    <Labeled key="employeefirstname" label="Employee First Name:">
                        <Typography variant="body2">{record.employeefirstname && record.employeefirstname}</Typography>
                    </Labeled>
                    <Labeled key="employeelastname" label="Employee Last Name:">
                        <Typography variant="body2">{record.employeelastname && record.employeelastname}</Typography>
                    </Labeled>
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
                    <Labeled
                        key="workactivitiesandissues"
                        label="Summary of the job activities, employee’s progress and any issues:"
                    >
                        <Typography variant="body2">
                            {record.workactivitiesandissues && record.workactivitiesandissues}
                        </Typography>
                    </Labeled>
                    <Typography variant="subtitle2">
                        <strong>ONLINE CLAIM CALCULATOR</strong>
                    </Typography>
                    <Labeled key="eligiblewages" label="Eligible this claim:">
                        <Typography variant="body2">{record.eligiblewages && record.eligiblewages}</Typography>
                    </Labeled>
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
                                    <TableCell align="center">Subsidy Rate Date From:</TableCell>
                                    <TableCell align="center">
                                        {record.subsidyratedatefrom1
                                            ? record.subsidyratedatefrom1.toString().substring(0, 10)
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell align="center">Subsidy Rate Date From:</TableCell>
                                    <TableCell align="center" sx={{ minWidth: "25%" }}>
                                        {record.subsidyratedatefrom2
                                            ? record.subsidyratedatefrom2.toString().substring(0, 10)
                                            : "N/A"}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="2" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="center">Subsidy Rate Date To:</TableCell>
                                    <TableCell align="center">
                                        {record.subsidyratedateto1
                                            ? record.subsidyratedateto1.toString().substring(0, 10)
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell align="center">Subsidy Rate Date To:</TableCell>
                                    <TableCell align="center">
                                        {record.subsidyratedateto2
                                            ? record.subsidyratedateto2.toString().substring(0, 10)
                                            : "N/A"}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="3" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="center">Total Weeks</TableCell>
                                    <TableCell align="center">
                                        {record.totalweeks1 && record.totalweeks1.toString()}
                                    </TableCell>
                                    <TableCell align="center">Total Weeks</TableCell>
                                    <TableCell align="center">
                                        {record.totalweeks2 && record.totalweeks2.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="4" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="center">Subsidy Rate Percent</TableCell>
                                    <TableCell align="center">
                                        {record.subsidyratepercent1 && record.subsidyratepercent1.toString()}%
                                    </TableCell>
                                    <TableCell align="center">Subsidy Rate Percent</TableCell>
                                    <TableCell align="center">
                                        {record.subsidyratepercent2 && record.subsidyratepercent2.toString()}%
                                    </TableCell>
                                </TableRow>
                                <TableRow key="5" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="center">Total Wages Paid</TableCell>
                                    <TableCell align="center">
                                        ${record.totalwage1 && (Number(record.totalwage1) / 100).toString()}
                                    </TableCell>
                                    <TableCell align="center">Total Wages Paid</TableCell>
                                    <TableCell align="center">
                                        ${record.totalwage2 && (Number(record.totalwage2) / 100).toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="6" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="center">Eligible Wages</TableCell>
                                    <TableCell align="center">
                                        ${record.eligiblewages && (Number(record.eligiblewages) / 100).toString()}
                                    </TableCell>
                                    <TableCell align="center">Eligible Wages</TableCell>
                                    <TableCell align="center">
                                        ${record.eligiblewages2 && (Number(record.eligiblewages2) / 100).toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="7" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="center">Wages Reimbursed</TableCell>
                                    <TableCell align="center">
                                        ${record.wagesreimbursed1 && record.wagesreimbursed1.toString()}
                                    </TableCell>
                                    <TableCell align="center">Wages Reimbursed</TableCell>
                                    <TableCell align="center">
                                        ${record.wagesreimbursed2 && record.wagesreimbursed2.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="8" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="center">Total MERCs paid</TableCell>
                                    <TableCell align="center">
                                        ${record.totalmercs1 && record.totalmercs1.toString()}
                                    </TableCell>
                                    <TableCell align="center">Total MERCs paid</TableCell>
                                    <TableCell align="center">
                                        ${record.totalmercs2 && record.totalmercs2.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="9" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="center">MERCs Reimbursed</TableCell>
                                    <TableCell align="center">
                                        ${record.mercsreimbursed1 && record.mercsreimbursed1.toString()}
                                    </TableCell>
                                    <TableCell align="center">MERCs Reimbursed</TableCell>
                                    <TableCell align="center">
                                        ${record.mercsreimbursed2 && record.mercsreimbursed2.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="10" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="center">Total Reimbursed</TableCell>
                                    <TableCell align="center">
                                        ${record.totalamountreimbursed1 && record.totalamountreimbursed1.toString()}
                                    </TableCell>
                                    <TableCell align="center">Total Reimbursed</TableCell>
                                    <TableCell align="center">
                                        ${record.totalamountreimbursed2 && record.totalamountreimbursed2.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="11" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="center">Total Subsidy Claimed</TableCell>
                                    <TableCell align="right" colSpan={3}>
                                        ${record.totalsubsidyclaimed && record.totalsubsidyclaimed.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="12" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="center">Claim Approved By</TableCell>
                                    <TableCell align="right" colSpan={3}>
                                        {record.claimapprovedby1 && record.claimapprovedby1.toString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="13" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell align="center">Claim Verified Date</TableCell>
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
