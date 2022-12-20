/* eslint-disable import/prefer-default-export */
import { Grid } from "@mui/material"
import {
    Button,
    DateInput,
    Edit,
    NumberInput,
    SaveButton,
    SimpleForm,
    TextInput,
    Toolbar,
    useRecordContext
} from "react-admin"

const CustomToolbar = () => (
    <Toolbar>
        <div>
            <SaveButton label="Save" />
        </div>
        <div>
            <Button label="Cancel" size="medium" sx={{}} />
        </div>
    </Toolbar>
)

const CalculatedInput = ({ source }: any, ...props: any) => {
    const record = useRecordContext()

    // const a = useInput(props)
    // console.log(a)
    if (source.includes("datefrom")) {
        return <DateInput source={source} fullWidth label="Subsidy Rate Date From" />
    }
    if (source.includes("dateto")) {
        return <DateInput source={source} fullWidth label="Subsidy Rate Date To" />
    }
    if (source.includes("totalweeks")) {
        return <NumberInput source={source} fullWidth label="Total Weeks" />
    }
    if (source.includes("ratepercent")) {
        return <NumberInput source={source} fullWidth label="Subsidy Rate Percent" />
    }
    if (source.includes("totalwage")) {
        return (
            <NumberInput
                source={source}
                fullWidth
                label="Total Wage"
                disabled
                format={(v) => parseFloat(String(v / 100)).toFixed(2)}
            />
        )
    }
    if (source.includes("eligiblewages")) {
        console.log(record)
        return <NumberInput source={source} disabled fullWidth label="Eligible Wages" />
    }
    if (source.includes("wagesreimbursed")) {
        return <NumberInput source={source} disabled fullWidth label="Wages Reimbursed" />
    }
    if (source.includes("totalmercs")) {
        return <NumberInput source={source} fullWidth label="Total MERCs" />
    }
    if (source.includes("mercsreimbursed")) {
        return <NumberInput source={source} fullWidth disabled label="MERCs Reimbursed" />
    }
    if (source.includes("totalamountreimbursed")) {
        return <NumberInput source={source} fullWidth disabled label="Total Amount Reimbursed" />
    }
    if (source.includes("subsidyclaimed")) {
        return <NumberInput source={source} disabled label="Subsidy Claimed" />
    }
    if (source.includes("claimapprovedby")) {
        return <TextInput source={source} label="Claim Approved By" />
    }
    return null
}

export const ClaimsEdit = (props: any) => (
    <Edit>
        <SimpleForm toolbar={<CustomToolbar />}>
            <Grid container spacing={1}>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={5}>
                        <p>Subsidy Rate Period 1</p>
                    </Grid>
                    <Grid item md={5}>
                        <p>Subsidy Rate Period 2</p>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={5}>
                        <CalculatedInput source="subsidyratedatefrom1" fullWidth />
                    </Grid>
                    <Grid item md={5}>
                        <CalculatedInput source="subsidyratedatefrom2" fullWidth />
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={5}>
                        <CalculatedInput source="subsidyratedateto1" fullWidth label="Subsidy Rate Date To" />
                    </Grid>
                    <Grid item md={5}>
                        <CalculatedInput source="subsidyratedateto2" fullWidth label="Subsidy Rate Date To" />
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={5}>
                        <CalculatedInput source="totalweeks1" fullWidth label="Total Weeks" />
                    </Grid>
                    <Grid item md={5}>
                        <CalculatedInput source="totalweeks2" fullWidth label="Total Weeks" />
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={5}>
                        <CalculatedInput source="subsidyratepercent1" fullWidth label="Subsidy Rate Percent" />
                    </Grid>
                    <Grid item md={5}>
                        <CalculatedInput source="subsidyratepercent2" fullWidth label="Subsidy Rate Percent" />
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={5}>
                        <CalculatedInput source="totalwage1" fullWidth disabled label="Total Wage 1" />
                    </Grid>
                    <Grid item md={5}>
                        <CalculatedInput source="totalwage2" fullWidth disabled label="Total Wage 2" />
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={5}>
                        <CalculatedInput source="eligiblewages" disabled fullWidth label="Eligible Wages" {...props} />
                    </Grid>
                    <Grid item md={5}>
                        <CalculatedInput source="eligiblewages2" disabled fullWidth label="Eligible Wages" />
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={5}>
                        <CalculatedInput source="wagesreimbursed1" disabled fullWidth label="Wages Reimbursed" />
                    </Grid>
                    <Grid item md={5}>
                        <CalculatedInput source="wagesreimbursed2" disabled fullWidth label="Wages Reimbursed" />
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={5}>
                        <CalculatedInput source="totalmercs1" fullWidth label="Total MERCs" />
                    </Grid>
                    <Grid item md={5}>
                        <CalculatedInput source="totalmercs2" fullWidth label="Total MERCs" />
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={5}>
                        <CalculatedInput source="mercsreimbursed1" disabled fullWidth label="MERCs Reimbursed" />
                    </Grid>
                    <Grid item md={5}>
                        <CalculatedInput source="mercsreimbursed2" disabled fullWidth label="MERCs Reimbursed" />
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={5}>
                        <CalculatedInput
                            source="totalamountreimbursed1"
                            disabled
                            fullWidth
                            label="Total Amount Reimbursed"
                        />
                    </Grid>
                    <Grid item md={5}>
                        <CalculatedInput
                            source="totalamountreimbursed2"
                            disabled
                            fullWidth
                            label="Total Amount Reimbursed"
                        />
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={5}>
                        <CalculatedInput source="totalsubsidyclaimed" disabled label="Total Subsidy Claimed" />
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item md={5}>
                        <CalculatedInput source="claimapprovedby1" label="Claim Approved By" />
                    </Grid>
                </Grid>
            </Grid>
        </SimpleForm>
    </Edit>
)
