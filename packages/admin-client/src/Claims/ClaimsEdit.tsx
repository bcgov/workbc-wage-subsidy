/* eslint-disable camelcase */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/prefer-default-export */
import { Grid } from "@mui/material"
import {
    DateInput,
    Edit,
    ListButton,
    Loading,
    NumberInput,
    SaveButton,
    SimpleForm,
    TextInput,
    Toolbar,
    TopToolbar,
    useGetOne,
    useGetRecordId,
    useNotify,
    useUpdate
} from "react-admin"
import { useWatch } from "react-hook-form"
import { useNavigate } from "react-router"
import jwt_decode from "jwt-decode"

const CustomToolbar = () => (
    <Toolbar>
        <SaveButton label="Save" />
    </Toolbar>
)

const CalculatedInput = ({ source, value }: any, ...props: any) => {
    // const a = useInput(props)
    // console.log(a)
    const decoded: any = jwt_decode(localStorage.getItem("token")?.toString() || "")
    const datefrom1 = new Date(useWatch({ name: "subsidyratedatefrom1" })) || NaN
    const dateto1 = new Date(useWatch({ name: "subsidyratedateto1" })) || NaN
    const datefrom2 = new Date(useWatch({ name: "subsidyratedatefrom2" })) || NaN
    const dateto2 = new Date(useWatch({ name: "subsidyratedateto2" })) || NaN
    const totalweeks1 = useWatch({ name: "totalweeks1" })
    const totalweeks2 = useWatch({ name: "totalweeks2" })
    const ratepercent1 = useWatch({ name: "subsidyratepercent1" })
    const ratepercent2 = useWatch({ name: "subsidyratepercent2" })
    const totalmercs1 = useWatch({ name: "totalmercs1" })
    const totalmercs2 = useWatch({ name: "totalmercs2" })
    const totalwage1 = useWatch({ name: "totalwage1" })
    const totalwage2 = useWatch({ name: "totalwage2" })
    const eligiblewages1 = Math.round(
        Number(totalwage1) / 100 > Number(totalweeks1) * 1000 ? Number(totalweeks1) * 1000 : Number(totalwage1) / 100
    )
    const eligiblewages2 = Math.round(
        Number(totalwage2) / 100 > Number(totalweeks2) * 1000 ? Number(totalweeks2) * 1000 : Number(totalwage2) / 100
    )
    if (source.includes("datefrom")) {
        return <DateInput source={source} fullWidth label="Subsidy Rate Date From" />
    }
    if (source.includes("dateto")) {
        return <DateInput source={source} fullWidth label="Subsidy Rate Date To" />
    }
    if (source.includes("totalweeks1")) {
        return (
            <NumberInput
                source={source}
                fullWidth
                value={value}
                label="Total Weeks"
                helperText={`Recommended Weeks: ${Math.round(
                    Math.round((dateto1.valueOf() - datefrom1.valueOf()) / (7 * 24 * 60 * 60 * 1000)) > 0
                        ? Math.round((dateto1.valueOf() - datefrom1.valueOf()) / (7 * 24 * 60 * 60 * 1000))
                        : 0
                )}`}
            />
        )
    }
    if (source.includes("totalweeks2")) {
        return (
            <NumberInput
                source={source}
                fullWidth
                value={value}
                label="Total Weeks"
                helperText={`Recommended Weeks: ${
                    Math.round((dateto2.valueOf() - datefrom2.valueOf()) / (7 * 24 * 60 * 60 * 1000)) > 0
                        ? Math.round((dateto2.valueOf() - datefrom2.valueOf()) / (7 * 24 * 60 * 60 * 1000))
                        : 0
                }`}
            />
        )
    }
    if (source.includes("ratepercent")) {
        return <NumberInput source={source} fullWidth value={value} label="Subsidy Rate Percent" />
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
    if (source === "eligiblewages") {
        return (
            <NumberInput
                source={source}
                disabled
                fullWidth
                label="Eligible Wages"
                format={() => eligiblewages1}
                helperText={`Max Wage: ${String(Number(totalweeks1) * 1000)}`}
            />
        )
    }
    if (source.includes("eligiblewages2")) {
        return (
            <NumberInput
                source={source}
                disabled
                fullWidth
                label="Eligible Wages"
                format={() => eligiblewages2}
                helperText={`Max Wage: ${String(Number(totalweeks2) * 1000)}`}
            />
        )
    }
    if (source.includes("wagesreimbursed1")) {
        return (
            <NumberInput
                source={source}
                fullWidth
                format={() => (Number(ratepercent1) * eligiblewages1) / 100}
                disabled
                label="Wages Reimbursed"
            />
        )
    }
    if (source.includes("wagesreimbursed2")) {
        return (
            <NumberInput
                source={source}
                fullWidth
                format={() => (Number(ratepercent2) * eligiblewages2) / 100}
                disabled
                label="Wages Reimbursed"
            />
        )
    }
    if (source.includes("totalmercs")) {
        return <NumberInput source={source} fullWidth label="Total MERCs" />
    }
    if (source.includes("mercsreimbursed1")) {
        return (
            <NumberInput
                source={source}
                fullWidth
                format={() => (Number(ratepercent1) * Number(totalmercs1)) / 100}
                parse={() => (Number(ratepercent1) * Number(totalmercs1)) / 100}
                disabled
                label="MERCs Reimbursed"
            />
        )
    }
    if (source.includes("mercsreimbursed2")) {
        return (
            <NumberInput
                source={source}
                fullWidth
                format={() => (Number(ratepercent2) * Number(totalmercs2)) / 100}
                parse={() => (Number(ratepercent2) * Number(totalmercs2)) / 100}
                disabled
                label="MERCs Reimbursed"
            />
        )
    }
    if (source.includes("totalamountreimbursed1")) {
        return (
            <NumberInput
                source={source}
                fullWidth
                disabled
                format={() =>
                    (Number(ratepercent1) * Number(totalmercs1)) / 100 + (Number(ratepercent1) * eligiblewages1) / 100
                }
                label="Total Amount Reimbursed"
            />
        )
    }
    if (source.includes("totalamountreimbursed2")) {
        return (
            <NumberInput
                source={source}
                fullWidth
                disabled
                format={() =>
                    (Number(ratepercent2) * Number(totalmercs2)) / 100 + (Number(ratepercent2) * eligiblewages2) / 100
                }
                label="Total Amount Reimbursed"
            />
        )
    }
    if (source.includes("subsidyclaimed")) {
        return (
            <NumberInput
                source={source}
                disabled
                format={() =>
                    (Number(ratepercent1) * Number(totalmercs1)) / 100 +
                    (Number(ratepercent1) * eligiblewages1) / 100 +
                    (Number(ratepercent2) * Number(totalmercs2)) / 100 +
                    (Number(ratepercent2) * eligiblewages2) / 100
                }
                label="Subsidy Claimed"
            />
        )
    }
    if (source.includes("claimapprovedby")) {
        return (
            <TextInput
                source={source}
                label="Claim Approved By"
                placeholder={decoded.display_name || ""}
                format={(v) => {
                    if (v === "NULL") {
                        return decoded.display_name || ""
                    }
                    return v
                }}
            />
        )
    }
    return null
}

const EditActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
)

export const ClaimsEdit = (props: any) => {
    const navigate = useNavigate()
    const notify = useNotify()
    const recordId = useGetRecordId()
    const {
        data,
        isLoading: isLoadingOne,
        error: oneError
    } = useGetOne(
        "claims",
        { id: recordId },
        {
            onSettled: (data, oneError) => {
                console.log(data, oneError)
            }
        }
    )

    if (isLoadingOne) {
        return <Loading />
    }
    if (oneError) {
        return <p>ERROR</p>
    }
    // eslint-disable-next-line @typescript-eslint/no-redeclare
    const [update, { isLoading, error }] = useUpdate()
    const claimSave = (newdata: any) => {
        // update totalweeks element of newdata with totalweeks1
        // eslint-disable-next-line no-param-reassign
        console.log(newdata.totalwage1)
        const eligiblewages1 = Math.round(
            Number(newdata.totalwage1) / 100 > Number(newdata.totalweeks1) * 1000
                ? Number(newdata.totalweeks1) * 1000
                : Number(newdata.totalwage1) / 100
        )
        const eligiblewages2 = Math.round(
            Number(newdata.totalwage2) / 100 > Number(newdata.totalweeks2) * 1000
                ? Number(newdata.totalweeks2) * 1000
                : Number(newdata.totalwage2) / 100
        )
        newdata.mercsreimbursed1 = Math.round((Number(newdata.subsidyratepercent1) * Number(newdata.totalmercs1)) / 100)
        newdata.mercsreimbursed2 = Math.round((Number(newdata.subsidyratepercent2) * Number(newdata.totalmercs2)) / 100)
        newdata.wagesreimbursed1 = Math.round((Number(newdata.subsidyratepercent1) * Number(eligiblewages1)) / 100)
        newdata.wagesreimbursed2 = Math.round((Number(newdata.subsidyratepercent2) * Number(eligiblewages2)) / 100)
        newdata.totalamountreimbursed1 = Math.round(newdata.wagesreimbursed1 + newdata.mercsreimbursed1)
        newdata.totalamountreimbursed2 = Math.round(newdata.wagesreimbursed2 + newdata.mercsreimbursed2)
        newdata.totalsubsidyclaimed = Math.round(newdata.totalamountreimbursed1 + newdata.totalamountreimbursed2)
        update(
            "claims",
            { id: recordId, data: newdata, previousData: data },
            {
                onSuccess: () => {
                    notify(`Updated`, { type: "success" })
                    navigate("/claims")
                },
                onError: (error) => {
                    notify(`Error ${error}`, { type: "error" })
                }
            }
        )
        if (isLoading) {
            notify(`Updating`, { type: "info" })
            return
        }
        if (error) {
            notify(`Error ${error}`, { type: "error" })
            return
        }
    }
    return (
        <Edit actions={<EditActions />}>
            <SimpleForm toolbar={<CustomToolbar />} onSubmit={claimSave}>
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
                            <CalculatedInput
                                source="eligiblewages"
                                disabled
                                fullWidth
                                label="Eligible Wages"
                                {...props}
                            />
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
}
