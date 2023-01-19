/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/prefer-default-export */
import { Cancel, Check } from "@mui/icons-material"
import { Typography } from "@mui/material"
import { useKeycloak } from "@react-keycloak/web"
import {
    BooleanField,
    BulkDeleteButton,
    BulkUpdateButton,
    CheckboxGroupInput,
    Datagrid,
    DateField,
    FilterButton,
    List,
    NumberField,
    Pagination,
    SelectInput,
    TextField,
    TopToolbar,
    useRecordContext
} from "react-admin"
import { CustomShow } from "../Claims/CustomShow"

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
            { id: "Cancelled", name: "Cancelled" }
        ]}
        alwaysOn
    />
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

const WagesBulkActionButtons = () => {
    const keycloak = useKeycloak()
    return (
        <>
            <MarkCompletedButton />
            <MarkInProgressButton />
            {/* default bulk delete action */}
            {keycloak.keycloak.tokenParsed?.identity_provider === "idir" && <BulkDeleteButton />}
        </>
    )
}

const PostPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />

export const WageList = (props: any) => (
    <List {...props} actions={<ListActions />} filters={formFilters} pagination={<PostPagination />}>
        <Datagrid expand={<PostShow {...props} />} bulkActionButtons={<WagesBulkActionButtons />}>
            <TextField source="id" />
            <NumberField source="catchmentno" label="CA" />
            <DateField source="created" />
            <TextField source="applicationid" />
            <TextField source="title" />
            <TextField source="applicationstatus" />
        </Datagrid>
    </List>
)
