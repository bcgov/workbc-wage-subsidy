/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/prefer-default-export */
import { Typography } from "@mui/material"
import { ResponsiveStyleValue, Stack, styled, SxProps } from "@mui/system"
import PropTypes from "prop-types"
import { ReactNode } from "react"
import { Labeled, OptionalRecordContextProvider, RaRecord, useRecordContext } from "react-admin"
import type { LabeledProps } from "react-admin"

// a custom lebelled component that passes the children to the Labelled component with only the label
//  being in 14px font size
const CustomLabeled = (props: LabeledProps) => {
    return (
        <Labeled key={props.key} label={<Typography sx={{ fontSize: "14px" }}>{props.label}</Typography>}>
            {props.children}
        </Labeled>
    )
}

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
    const positions = ["0", "1"]

    return (
        <OptionalRecordContextProvider value={props.record}>
            <Root className={className} {...sanitizeRestProps(rest)}>
                <Stack spacing={spacing} divider={divider} className={SimpleShowLayoutClasses.stack}>
                    <Typography variant="subtitle2">
                        <strong>WORK EXPERIENCE WAGE SUBSIDY - {record.formtype} FORM</strong>
                    </Typography>
                    <CustomLabeled key="id" label="ID">
                        <Typography variant="body2">{record.id && record.id.toString()}</Typography>
                    </CustomLabeled>
                    <CustomLabeled key="Title" label="Title">
                        <Typography variant="body2">{record.title}</Typography>
                    </CustomLabeled>
                    <CustomLabeled key="formType" label="Form Type:">
                        <Typography variant="body2">{record.formtype}</Typography>
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
                    <CustomLabeled key="modified" label="Application Modified Date">
                        <Typography variant="body2">
                            {record.modified && record.modified.toString().substring(0, 10)}
                        </Typography>
                    </CustomLabeled>
                    <Typography variant="subtitle2">
                        <strong>BUSINESS INFOMATION</strong>
                    </Typography>
                    <CustomLabeled
                        key="WorkBCCentreBool"
                        label={
                            <Typography sx={{ fontSize: "14px" }}>
                                Are you currently working with a WorkBC Centre?
                            </Typography>
                        }
                    >
                        <Typography variant="body2">{record.centrename === "" ? "No" : "Yes"}</Typography>
                    </CustomLabeled>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Stack>
                            <CustomLabeled
                                key="WorkBCCentre"
                                label={<Typography sx={{ fontSize: "14px" }}>WorkBC Centre:</Typography>}
                            >
                                <Typography variant="body2">{record.centrename}</Typography>
                            </CustomLabeled>
                            <CustomLabeled key="operatingname" label="Organization Name:">
                                <Typography variant="body2">{record.operatingname}</Typography>
                            </CustomLabeled>
                            <CustomLabeled key="businessaddress1" label="Address:">
                                <Typography variant="body2">
                                    {record.businessaddress1 && record.businessaddress1.toString()}
                                </Typography>
                            </CustomLabeled>
                            <CustomLabeled key="businesscity" label="City/Town:">
                                <Typography variant="body2">{record.businesscity}</Typography>
                            </CustomLabeled>
                            <CustomLabeled key="businessphone" label="Phone Number:">
                                <Typography variant="body2">
                                    {record.businessphone && record.businessphone.toString()}
                                </Typography>
                            </CustomLabeled>
                            <CustomLabeled key="businessfax" label="Fax Number:">
                                <Typography variant="body2">
                                    {record.businessfax && record.businessfax.toString()}
                                </Typography>
                            </CustomLabeled>
                        </Stack>
                        <Stack>
                            <CustomLabeled
                                key="catchmentno"
                                label={<Typography sx={{ fontSize: "14px" }}>Catchment Number:</Typography>}
                            >
                                <Typography variant="body2">
                                    {record.catchmentno && record.catchmentno.toString()}
                                </Typography>
                            </CustomLabeled>
                            <CustomLabeled
                                key="CRA"
                                label={<Typography sx={{ fontSize: "14px" }}>CRA Business Number:</Typography>}
                            >
                                <Typography variant="body2">
                                    {record.bussinessnumber && record.bussinessnumber.toString()}
                                </Typography>
                            </CustomLabeled>
                            <CustomLabeled
                                key="businessprovince"
                                label={<Typography sx={{ fontSize: "14px" }}>Business Province:</Typography>}
                            >
                                <Typography variant="body2">{record.businessprovince}</Typography>
                            </CustomLabeled>
                            <CustomLabeled key="businesspostal" label="Business Postal Code:">
                                <Typography variant="body2">
                                    {record.businesspostal && record.businesspostal.toString()}
                                </Typography>
                            </CustomLabeled>
                            <CustomLabeled key="businessemail" label="Employer Email Address:">
                                <Typography variant="body2">
                                    {record.businessemail && record.businessemail.toString()}
                                </Typography>
                            </CustomLabeled>
                        </Stack>
                        <div></div>
                    </Stack>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Stack>
                            <CustomLabeled key="sectortype" label="Type of Sector:">
                                <Typography variant="body2">{record.sectortype}</Typography>
                            </CustomLabeled>
                        </Stack>
                        <Stack>
                            <CustomLabeled key="typeofindestry" label="Type of Industry:">
                                <Typography variant="body2">{record.typeofindustry}</Typography>
                            </CustomLabeled>
                        </Stack>
                        <div></div>
                    </Stack>
                    <CustomLabeled key="organizationsize" label="Size of Organization:">
                        <Typography variant="body2">{record.organizationsize}</Typography>
                    </CustomLabeled>
                    <CustomLabeled
                        key="cewsandorcrhp"
                        label="Are you actively participating in the Canada Emergency Wage Subsidy program and/or the Canada Recovery Hiring Program (CRHP)?"
                    >
                        <Typography variant="body2">{record.cewsandorcrhp}</Typography>
                    </CustomLabeled>
                    <CustomLabeled
                        key="employeedisplacement"
                        label="Will the subsidy result in the displacement of existing employees or volunteers?"
                    >
                        <Typography variant="body2">
                            {record.employeedisplacement && record.employeedisplacement === true ? "Yes" : "No"}
                        </Typography>
                    </CustomLabeled>
                    <CustomLabeled
                        key="labourdispute"
                        label="Is there a labour stoppage or labour - management dispute in progress?"
                    >
                        <Typography variant="body2">
                            {record.labourdispute && record.labourdispute === true ? "Yes" : "No"}
                        </Typography>
                    </CustomLabeled>
                    <CustomLabeled key="unionconcurrence" label="Is there a Union concurrence?">
                        <Typography variant="body2">{record.unionconcurrence}</Typography>
                    </CustomLabeled>
                    <CustomLabeled
                        key="liabilitycoverage"
                        label="Does your organization have 3rd Party liability coverage?"
                    >
                        <Typography variant="body2">
                            {record.liabilitycoverage && record.liabilitycoverage === true ? "Yes" : "No"}
                        </Typography>
                    </CustomLabeled>
                    <CustomLabeled
                        key="wsbccoverage"
                        label="Is your organization currently receiving funding under a WorkBC Wage Subsidy agreement?"
                    >
                        <Typography variant="body2">
                            {record.wsbccoverage && record.wsbccoverage === true ? "Yes" : "No"}
                        </Typography>
                    </CustomLabeled>
                    <CustomLabeled key="wsbcnumber" label="WorkSafe BC Number:">
                        <Typography variant="body2">{record.wsbcnumber}</Typography>
                    </CustomLabeled>
                    <CustomLabeled
                        key="orgeligilibityconsent"
                        label="Meets the eligibility criteria and acknowledges that all the obligations the employer owes to or has with respect to its other employees under the various listed statutes and all other applicable laws apply equally to an individual employed in a wage subsidy placement: "
                    >
                        <Typography variant="body2">
                            {record.orgeligibilityconsent && record.orgeligibilityconsent === true ? "Yes" : "No"}
                        </Typography>
                    </CustomLabeled>
                    <CustomLabeled
                        key="lawcomplianceconsent"
                        label="Certifies that it is in full compliance with all applicable laws, including the Employment Standards Act, the Workers Compensation Act and the Human Rights Code: "
                    >
                        <Typography variant="body2">
                            {record.lawcomplianceconsent && record.lawcomplianceconsent === true ? "Yes" : "No"}
                        </Typography>
                    </CustomLabeled>
                    {positions.map((position, index) => {
                        return (
                            record[`positiontitle${position}`] &&
                            record[`positiontitle${position}`].length > 0 && (
                                <>
                                    <Typography variant="subtitle2">
                                        <strong>JOB INFOMATION - {record[`positiontitle${position}`]}</strong>
                                    </Typography>
                                    <Stack direction="row" spacing={2} justifyContent="space-between">
                                        <Stack>
                                            <CustomLabeled key="positiontitle" label="Position Title:">
                                                <Typography variant="body2">
                                                    {record[`positiontitle${position}`]}
                                                </Typography>
                                            </CustomLabeled>
                                            <CustomLabeled key="numberofpositions" label="Number of Positions:">
                                                <Typography variant="body2">
                                                    {record[`numberofpositions${position}`]}
                                                </Typography>
                                            </CustomLabeled>
                                            <CustomLabeled key="startdate" label="Anticipated Start Date:">
                                                <Typography variant="body2">
                                                    {record[`startdate${position}`] &&
                                                        record[`startdate${position}`].toString().substring(0, 10)}
                                                </Typography>
                                            </CustomLabeled>
                                        </Stack>
                                        <Stack>
                                            <CustomLabeled key="hours" label="Hours of Work per week:">
                                                <Typography variant="body2">{record[`hours${position}`]}</Typography>
                                            </CustomLabeled>
                                            <CustomLabeled key="wage" label="Hourly Wage:">
                                                <Typography variant="body2">
                                                    {record[`wage${position}`] &&
                                                        (Number(record[`wage${position}`]) / 100).toString()}
                                                </Typography>
                                            </CustomLabeled>
                                            <CustomLabeled key="mercs" label="MERCs:">
                                                <Typography variant="body2">
                                                    {record[`applicationmercs${position}`]}
                                                </Typography>
                                            </CustomLabeled>
                                        </Stack>
                                        <div></div>
                                    </Stack>
                                    <CustomLabeled key="duties" label="Description of duties:">
                                        <Typography variant="body2">{record[`duties${position}`]}</Typography>
                                    </CustomLabeled>
                                    <CustomLabeled
                                        key="skills"
                                        label="Skills and experience normally required for this position:"
                                    >
                                        <Typography variant="body2">{record[`skills${position}`]}</Typography>
                                    </CustomLabeled>
                                    <CustomLabeled
                                        key="workexperience"
                                        label="What work experience, training, supervision, etc., will the employee receive during the Wage Subsidy Placement?: "
                                    >
                                        <Typography variant="body2">{record[`workexperience${position}`]}</Typography>
                                    </CustomLabeled>
                                </>
                            )
                        )
                    })}
                    <CustomLabeled key="signatorytitle" label="Signing Authority Title:">
                        <Typography variant="body2">{record.signatorytitle}</Typography>
                    </CustomLabeled>
                    <CustomLabeled key="signatory1" label="Signing Authority Full Name:">
                        <Typography variant="body2">{record.signatory1}</Typography>
                    </CustomLabeled>
                    <CustomLabeled key="organizationconsent" label="Organization Consent:">
                        <Typography variant="body2">
                            {record.organizationconsent && record.organizationconsent === true ? "Yes" : "No"}
                        </Typography>
                    </CustomLabeled>
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
