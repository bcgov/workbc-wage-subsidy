import { Box, Checkbox, Chip, CircularProgress, Stack, Tooltip } from "@mui/material"
import {
    FunctionField,
    List,
    TextField,
    useCreate,
    useGetIdentity,
    useRedirect,
    maxLength,
    SimpleForm,
    SaveButton,
    useDataProvider,
    Button
} from "react-admin"
import { applicationStatusFilters } from "../Applications/ApplicationList"
import { DatagridStyles } from "../common/styles/DatagridStyles"
import { CustomSearchInput } from "./ClaimCustomSearchInput"
import CustomDatagrid from "../common/components/CustomDatagrid/CustomDatagrid"
import { COLOURS } from "../Colours"
import { v4 as uuidv4 } from "uuid"
import { useState } from "react"
import Grid from "@mui/material/Grid"
import StyledTextInput from "../common/components/Forms/Fields/StyledTextInput"
import { faInfoCircle } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const applicationFilters = [
    <CustomSearchInput
        placeholder="Search for application..."
        source="form_confirmation_id"
        alwaysOn
        style={{ width: "18em" }}
    />
]

export const ClaimCreateSelectApplication = (props: any) => {
    const { identity } = useGetIdentity()
    const redirect = useRedirect()
    const [create] = useCreate()
    const dataProvider = useDataProvider()
    const [loading, setLoading] = useState(false)
    const [legacySelected, setLegacySelected] = useState(false)
    const [addressValidated, setAddressValidated] = useState(false)
    const [validationData, setValidationData] = useState<any>(null)
    const [validationMessage, setValidationMessage] = useState("")

    const handleClick = async (id, resource, record) => {
        if (identity?.guid && record?.form_confirmation_id && !loading) {
            setLoading(true)
            await create(
                "claims",
                { data: { formKey: uuidv4(), guid: identity.guid, application_id: record.form_confirmation_id } },
                {
                    onSuccess: (data) => {
                        setLoading(false)
                        redirect("/ViewForm/claims/" + data.id, "")
                    },
                    onError: () => {
                        setLoading(false)
                    }
                }
            )
        }
    }

    const handleSubmit = async (data: any) => {
        if (!addressValidated) {
            // attempt to validate the address //
            const validationResult = await dataProvider.validateAddress({
                address: data.address,
                city: data.city,
                province: "BC"
            })
            if (validationResult.data.Score >= 95) {
                setAddressValidated(true)
                setValidationData(validationResult.data)
                setValidationMessage("Address Validated")
            } else {
                setAddressValidated(false)
                setValidationData(null)
                setValidationMessage("Invalid Address")
            }
        }
    }

    const validateAddressForm = (values) => {
        const errors = {}
        if (!values.address) {
            errors["address"] = "Address is required"
        }
        if (!values.city) {
            errors["city"] = "City is required"
        }
        return errors
    }

    const circularProgressStyle = {
        "&.MuiCircularProgress-root": {
            marginRight: "10px",
            marginLeft: "2px"
        }
    }

    return (
        <Box minWidth="60em" minHeight="35em">
            <>
                <List
                    {...props}
                    resource="applications"
                    filter={applicationStatusFilters["Completed"]}
                    filters={applicationFilters}
                    filterDefaultValues={{ dummyFilter: -1 }} // Having at least 1 filter prevents redirection to default empty screen when empty.
                    actions={false} // Disable default list actions.
                    sx={{
                        "& .RaList-content": {
                            padding: "0em 1em"
                        },
                        // Right-align search bar.
                        "& .RaFilterForm-filterFormInput": {
                            justifyContent: "end",
                            width: "100%",
                            minWidth: "60em"
                        }
                    }}
                >
                    <div>
                        <p>
                            <strong>Select the application you want to submit a claim for</strong>
                        </p>
                    </div>

                    <CustomDatagrid
                        sx={DatagridStyles}
                        rowClick={handleClick}
                        ariaLabel="list of completed applications"
                        rowAriaLabel="create a claim form for application"
                        disableBulkActions={true}
                        empty={
                            <p style={{ padding: "16px" }}>
                                You must have at least one completed application in order to submit a claim
                            </p>
                        }
                    >
                        <TextField label="Submission ID" source="form_confirmation_id" emptyText="-" />
                        <TextField label="Position Title" source="position_title" emptyText="-" />
                        <TextField label="Number of Positions" source="num_positions" emptyText="-" />{" "}
                        <FunctionField
                            label="Submitted Date"
                            sortBy="form_submitted_date,updated_date,created_date"
                            sortByOrder="DESC"
                            render={(record: any) =>
                                record.form_submitted_date
                                    ? new Date(record.form_submitted_date).toLocaleDateString()
                                    : "-"
                            }
                        />
                        <FunctionField
                            label={
                                <Box display="flex" width="100%" justifyContent="center">
                                    Status
                                </Box>
                            }
                            render={(record: any) => (
                                <Box display="flex" width="100%" justifyContent="center">
                                    <Chip
                                        label={record.status}
                                        size="small"
                                        color={record.status === "Completed" ? "success" : "error"}
                                    />
                                </Box>
                            )}
                        />
                    </CustomDatagrid>
                </List>
                <Box display="flex">
                    <Grid container direction="column" height="100%">
                        <Grid item>
                            <Grid container direction="row">
                                <Grid item xs={11}>
                                    <Grid container direction="row" alignItems={"center"} spacing={0}>
                                        <Checkbox
                                            color="primary"
                                            checked={legacySelected}
                                            onClick={() => {
                                                setLegacySelected(!legacySelected)
                                                setAddressValidated(false)
                                                setValidationMessage("")
                                            }}
                                            size="small"
                                        />
                                        <a style={{ marginRight: 5 }}>My application is not on this system</a>
                                        <Tooltip title="Check this box if your application was submitted through WorkBC.ca before January 17, 2024, or if you submitted your application by another method (e.g. email, paper submission)">
                                            <FontAwesomeIcon
                                                icon={faInfoCircle}
                                                style={{ color: COLOURS.LIGHTBLUE_TEXT }}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    {legacySelected && (
                                        <>
                                            <Grid item xs={9}>
                                                <Grid container direction="row" alignItems={"center"}>
                                                    <h4 style={{ marginRight: 5 }}>
                                                        Enter your BC Business Address and validate to continue
                                                    </h4>
                                                </Grid>
                                            </Grid>
                                            <SimpleForm
                                                onSubmit={handleSubmit}
                                                toolbar={false}
                                                sx={{ padding: "1em 0em" }}
                                                mode="onBlur"
                                                reValidateMode="onBlur"
                                                validate={validateAddressForm}
                                            >
                                                <Stack direction="column" spacing={3}>
                                                    <StyledTextInput
                                                        source="address"
                                                        label="Address"
                                                        sx={{ minWidth: "20em" }}
                                                        validate={maxLength(255)}
                                                        disabled={addressValidated}
                                                    />
                                                    <StyledTextInput
                                                        source="city"
                                                        label="City / Town"
                                                        sx={{ minWidth: "20em" }}
                                                        validate={maxLength(255)}
                                                        disabled={addressValidated}
                                                    />
                                                </Stack>
                                                <Stack direction="row" spacing={3}>
                                                    <SaveButton
                                                        label="Validate"
                                                        icon={<></>}
                                                        style={{ marginTop: 5, minWidth: 150 }}
                                                        disabled={addressValidated}
                                                    ></SaveButton>
                                                    <Button
                                                        label="Create"
                                                        variant="contained"
                                                        style={{ marginTop: 5, minWidth: 150 }}
                                                        disabled={!addressValidated || loading}
                                                        onClick={async () => {
                                                            if (
                                                                addressValidated &&
                                                                identity?.guid &&
                                                                validationData &&
                                                                !loading
                                                            ) {
                                                                setLoading(true)
                                                                await dataProvider
                                                                    .createLegacyClaim({
                                                                        formKey: uuidv4(),
                                                                        guid: identity.guid,
                                                                        catchment: validationData.Catchment,
                                                                        storefront: validationData.Storefront,
                                                                        address: validationData.FullAddress.address,
                                                                        city: validationData.FullAddress.city
                                                                    })
                                                                    .then((res) => {
                                                                        setLoading(false)
                                                                        redirect("/ViewForm/claims/" + res.id, "")
                                                                    })
                                                                    .catch((err) => {
                                                                        setLoading(false)
                                                                    })
                                                            }
                                                        }}
                                                    >
                                                        {loading ? (
                                                            <CircularProgress
                                                                sx={circularProgressStyle}
                                                                size={14}
                                                                thickness={3}
                                                                color="inherit"
                                                            />
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </Button>
                                                </Stack>
                                                <a>{validationMessage}</a>
                                            </SimpleForm>
                                        </>
                                    )}
                                </Grid>
                                <Grid item xs={1}>
                                    <Box display="flex" justifyContent="right" style={{ paddingBottom: "3em" }}>
                                        <img
                                            width="110em"
                                            src="/woman-checkmark.svg"
                                            alt=""
                                            style={{ transform: "translate(-2em, 2.5em)" }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </>
        </Box>
    )
}
