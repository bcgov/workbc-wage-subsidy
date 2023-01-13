/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/prefer-default-export */
import { Cancel, Check } from "@mui/icons-material"
import { Typography } from "@mui/material"
import {
    BooleanField,
    BulkDeleteButton,
    BulkUpdateButton,
    CheckboxGroupInput,
    Datagrid,
    DateField,
    EditButton,
    FilterButton,
    List,
    NumberField,
    SearchInput,
    SelectInput,
    TextField,
    TopToolbar,
    useRecordContext
} from "react-admin"
import { CustomShow } from "./CustomShow"

const FormattedFunctionField = ({ source }: any) => {
    const record = useRecordContext()
    const re = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/
    console.log(record[source])
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

const PostShow = (...props: any) => (
    <CustomShow>
        <EditButton />
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

// eslint-disable-next-line prefer-const
let choices: any[] | undefined = []
// eslint-disable-next-line no-plusplus
for (let i = 1; i <= 45; i++) {
    choices.push({ id: i, name: `${i}` })
}

const formFilters = [
    <SelectInput key="caFilter" source="catchmentno" label="Catchment" choices={choices} emptyText="All" alwaysOn />,
    <CheckboxGroupInput
        key="statusFilter"
        source="applicationstatus"
        label=""
        choices={[
            { id: "NULL", name: "New" },
            { id: "In Progress", name: "In Progress" },
            { id: "Completed", name: "Completed" },
            { id: "Cancelled", name: "Cancelled" }
        ]}
        alwaysOn
    />,
    <SearchInput key="searchID" source="id" />
]

const ListActions = () => (
    <TopToolbar>
        <FilterButton />
    </TopToolbar>
)

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
        icon={<Cancel />}
    />
)

const ClaimsBulkActionButtons = () => (
    <>
        <MarkCompletedButton />
        <MarkInProgressButton />
        {/* default bulk delete action */}
        <BulkDeleteButton />
    </>
)

export const ClaimsList = (props: any) => (
    <List {...props} actions={<ListActions />} filters={formFilters}>
        <Datagrid expand={<PostShow {...props} />} bulkActionButtons={<ClaimsBulkActionButtons />}>
            <TextField source="id" />
            <NumberField source="catchmentno" label="CA" />
            <DateField source="created" />
            <TextField source="applicationid" />
            <TextField source="title" />
            <TextField source="applicationstatus" />
        </Datagrid>
    </List>
)
