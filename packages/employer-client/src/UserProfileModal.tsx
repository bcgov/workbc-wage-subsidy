import BCGovModal from "./common/components/BCGovModal/BCGovModal"
import ModalButton from "./common/components/BCGovModal/BCGovModalButton"
import {
    SaveButton,
    SimpleForm,
    useCreate,
    useDataProvider,
    useGetIdentity,
    useLogout,
    maxLength,
    email,
    regex
} from "react-admin"
import { useEffect, useState } from "react"
import { Box } from "@mui/system"
import { Stack } from "@mui/material"
import StyledTextInput from "./common/components/Forms/Fields/StyledTextInput"
import StyledSelectInput from "./common/components/Forms/Fields/StyledSelectInput"
import { useMutation } from "react-query"

const SaveButtonStyles = {
    color: "#307FE2",
    fontSize: "16px",
    backgroundColor: "transparent",
    border: "none",
    boxShadow: "none",
    fontFamily: "'BCSans', 'Noto Sans', Verdana, Arial, sans-serif",
    "&:hover": {
        opacity: "0.80",
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none"
    }
}

interface UserProfileModalProps {
    isOpen: boolean
    onRequestClose: (event: any) => void
    contentLabel: string
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onRequestClose, contentLabel }) => {
    const { identity } = useGetIdentity()
    const dataProvider = useDataProvider()
    const logout = useLogout()
    const [profileExists, setProfileExists] = useState<boolean>(false)
    const [userProfile, setUserProfile] = useState<any>(null)
    const [create] = useCreate()
    const [loading, setLoading] = useState(false)

    // When used in React Admin, useMutation() activates the loading indicator during queries.
    const { mutate: getProfile } = useMutation((userGuid: string) => {
        return dataProvider.getOneEmployer({ id: userGuid }).then(({ data }) => {
            setUserProfile(data)
            setLoading(false)
        })
    })

    const { mutate: saveProfile } = useMutation((data: any) => {
        const { id: userGuid, ...formData } = data
        return dataProvider.updateEmployer({ id: userGuid, data: formData, previousData: undefined })
    })

    const { mutate: createProfileIfNotExists } = useMutation((identity: any) => {
        return create(
            "employers",
            {
                data: {
                    id: identity.guid,
                    contact_name: identity.fullName || null,
                    contact_email: identity.email || null,
                    bceid_business_guid: identity.businessGuid || null,
                    bceid_business_name: identity.businessName || null
                }
            },
            {
                onSuccess: () => {
                    setProfileExists(true)
                },
                onError: () => {
                    logout()
                }
            }
        )
    })

    const handleSubmit = (data: any) => {
        saveProfile(data)
        onRequestClose(null)
    }

    useEffect(() => {
        if (isOpen && identity && profileExists) {
            getProfile(identity.guid)
        }
    }, [isOpen, profileExists])

    useEffect(() => {
        if (!isOpen) {
            setUserProfile(null)
        }
    }, [isOpen])

    useEffect(() => {
        if (identity) {
            createProfileIfNotExists(identity)
        }
    }, [identity])

    return (
        <>
            {!loading && userProfile && (
                <BCGovModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={contentLabel}>
                    <h2>Edit Profile</h2>
                    <SimpleForm
                        resource="employers"
                        record={userProfile}
                        onSubmit={handleSubmit}
                        toolbar={false}
                        sx={{ padding: "0em 0em" }}
                        mode="onBlur"
                        reValidateMode="onBlur"
                    >
                        <Stack direction="column" spacing={0} paddingTop="2em">
                            <Stack direction="column" spacing={2}>
                                <Stack direction="row" spacing={6}>
                                    <StyledTextInput
                                        source="bceid_business_name"
                                        label="Employer Name (Business Name)"
                                        sx={{ minWidth: "20em" }}
                                        validate={maxLength(255)}
                                    />
                                    <StyledTextInput
                                        source="contact_name"
                                        label="Employer Contact"
                                        sx={{ minWidth: "20em" }}
                                        validate={maxLength(255)}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={6}>
                                    <StyledTextInput
                                        source="phone_number"
                                        label="Phone Number"
                                        sx={{ minWidth: "20em" }}
                                        validate={maxLength(12)}
                                    />
                                    <StyledTextInput
                                        source="contact_email"
                                        label="Employer Email Address"
                                        sx={{ minWidth: "20em" }}
                                        validate={[email(), maxLength(255)]}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={6}>
                                    <StyledTextInput
                                        source="fax_number"
                                        label="Fax Number"
                                        sx={{ minWidth: "20em" }}
                                        validate={maxLength(12)}
                                    />
                                    <StyledTextInput
                                        source="cra_business_number"
                                        label="CRA Business Number"
                                        sx={{ minWidth: "20em" }}
                                        validate={regex(
                                            /^[0-9]{9}[A-Z]{2}[0]{3}[1]/,
                                            "Must have format: [0-9]{9}[A-Z]{2}[0]{3}[1]"
                                        )}
                                    />
                                </Stack>
                            </Stack>
                            <h3>Address</h3>
                            <Stack direction="column" spacing={2} sx={{ paddingTop: "1em" }}>
                                <StyledTextInput source="street_address" label="Address" sx={{ minWidth: "43em" }} />
                                <Stack direction="row" spacing={6}>
                                    <StyledTextInput
                                        source="city"
                                        label="City"
                                        sx={{ minWidth: "20em" }}
                                        validate={maxLength(255)}
                                    />
                                    <StyledSelectInput
                                        source="province"
                                        label="Province"
                                        sx={{ minWidth: "20em" }}
                                        choices={[
                                            { id: "AB", name: "Alberta" },
                                            { id: "BC", name: "British Columbia" },
                                            { id: "MB", name: "Manitoba" },
                                            { id: "NB", name: "New Brunswick" },
                                            { id: "NL", name: "Newfoundland & Labrador" },
                                            { id: "NT", name: "Northwest Territories" },
                                            { id: "NS", name: "Nova Scotia" },
                                            { id: "NU", name: "Nunavut" },
                                            { id: "ON", name: "Ontario" },
                                            { id: "PE", name: "Prince Edward Island" },
                                            { id: "QC", name: "Quebec" },
                                            { id: "SK", name: "Saskachewan" },
                                            { id: "YT", name: "Yukon" }
                                        ]}
                                    />
                                </Stack>
                                <StyledTextInput
                                    source="postal_code"
                                    label="Postal Code"
                                    sx={{ maxWidth: "20em" }}
                                    validate={maxLength(255)}
                                />
                            </Stack>
                            <h3>
                                Workplace Address{" "}
                                <span style={{ fontWeight: "normal" }}>(if different from above)</span>
                            </h3>
                            <Stack direction="column" spacing={2} sx={{ paddingTop: "1em" }}>
                                <StyledTextInput
                                    source="workplace_street_address"
                                    label="Address"
                                    sx={{ minWidth: "43em" }}
                                    validate={maxLength(255)}
                                />
                                <Stack direction="row" spacing={6}>
                                    <StyledTextInput
                                        source="workplace_city"
                                        label="City"
                                        sx={{ minWidth: "20em" }}
                                        validate={maxLength(255)}
                                    />
                                    <StyledSelectInput
                                        source="workplace_province"
                                        label="Province"
                                        sx={{ minWidth: "20em" }}
                                        choices={[{ id: "BC", name: "British Columbia" }]}
                                    />
                                </Stack>
                                <StyledTextInput
                                    source="workplace_postal_code"
                                    label="Postal Code"
                                    sx={{ maxWidth: "20em" }}
                                    validate={maxLength(255)}
                                />
                                <Stack direction="row" spacing={6}>
                                    <StyledSelectInput
                                        source="workbc_centre"
                                        label="WorkBC Centre"
                                        sx={{ minWidth: "32em" }}
                                        choices={[
                                            { id: "1-1", name: "WorkBC Centre - Campbell River" },
                                            { id: "1-2", name: "WorkBC Centre - Port Hardy" },
                                            { id: "2-1", name: "WorkBC Centre - Courtenay" },
                                            { id: "2-2", name: "WorkBC Centre - Powell River" },
                                            { id: "3-1", name: "WorkBC Centre - Port Alberni" },
                                            { id: "3-2", name: "WorkBC Centre - Ucluelet" },
                                            { id: "3-3", name: "WorkBC Centre - Tofino" },
                                            { id: "3-4", name: "WorkBC Centre - Parksville" },
                                            { id: "4-1", name: "WorkBC Centre - Nanaimo" },
                                            { id: "5-1", name: "WorkBC Centre - Duncan" },
                                            { id: "5-2", name: "WorkBC Centre - Ladysmith" },
                                            { id: "6-1", name: "WorkBC Centre - Langford" },
                                            { id: "6-2", name: "WorkBC Centre - Sooke" },
                                            { id: "7-1", name: "WorkBC Centre - Victoria - Douglas" },
                                            { id: "7-2", name: "WorkBC Centre - Victoria - Borden" },
                                            { id: "8-1", name: "WorkBC Centre - Sidney" },
                                            { id: "8-2", name: "WorkBC Centre - Salt Spring Island" },
                                            { id: "9-1", name: "WorkBC Centre - Sechelt" },
                                            { id: "9-2", name: "WorkBC Centre - Squamish" },
                                            { id: "10-1", name: "WorkBC Centre - North Vancouver" },
                                            { id: "11-1", name: "WorkBC Centre - Vancouver - 134 East Hastings" },
                                            { id: "11-2", name: "WorkBC Centre - Vancouver - Burrard" },
                                            { id: "11-3", name: "WorkBC Centre - Vancouver - W Pender" },
                                            { id: "12-1", name: "WorkBC Centre - Vancouver - East 3rd" },
                                            { id: "12-2", name: "WorkBC Centre - Vancouver - Midtown West" },
                                            { id: "13-1", name: "WorkBC Centre - Vancouver - Commercial" },
                                            { id: "14-1", name: "WorkBC Centre - Vancouver - South" },
                                            { id: "15-1", name: "WorkBC Centre - Richmond - No 5" },
                                            { id: "15-2", name: "WorkBC Centre - Richmond - Granville Ave" },
                                            { id: "16-1", name: "WorkBC Centre - Maple Ridge" },
                                            { id: "17-1", name: "WorkBC Centre - Port Moody" },
                                            { id: "17-2", name: "WorkBC Centre - Coquitlam" },
                                            { id: "17-3", name: "WorkBC Centre - Port Coquitlam" },
                                            { id: "18-1", name: "WorkBC Centre - Delta - 88th" },
                                            { id: "18-2", name: "WorkBC Centre - Delta - Delta St" },
                                            { id: "19-1", name: "WorkBC Centre - Surrey - Guildford" },
                                            { id: "19-2", name: "WorkBC Centre - Surrey - Whalley" },
                                            { id: "20-1", name: "WorkBC Centre - Surrey - 56 Ave" },
                                            { id: "21-1", name: "WorkBC Centre - Surrey - Newton" },
                                            { id: "22-1", name: "WorkBC Centre - Surrey - 152 St" },
                                            { id: "23-1", name: "WorkBC Centre - Langley" },
                                            { id: "23-2", name: "WorkBC Centre - Aldergrove" },
                                            { id: "24-1", name: "WorkBC Centre - Burnaby - Metrotown" },
                                            { id: "24-2", name: "WorkBC Centre - Burnaby - Brentwood" },
                                            { id: "24-3", name: "WorkBC Centre - Burnaby - Edmonds" },
                                            { id: "25-1", name: "WorkBC Centre - New Westminster" },
                                            { id: "26-1", name: "WorkBC Centre - Mission" },
                                            { id: "27-1", name: "WorkBC Centre - Abbotsford" },
                                            { id: "28-1", name: "WorkBC Centre - Chilliwack" },
                                            { id: "28-2", name: "WorkBC Centre - Hope" },
                                            { id: "28-3", name: "WorkBC Centre - Agassiz" },
                                            { id: "29-1", name: "WorkBC Centre - Quesnel" },
                                            { id: "29-2", name: "WorkBC Centre - Williams Lake" },
                                            { id: "29-3", name: "WorkBC Centre - 100 Mile House" },
                                            { id: "29-4", name: "WorkBC Centre - Bella Coola" },
                                            { id: "30-1", name: "WorkBC Centre - Merritt" },
                                            { id: "30-2", name: "WorkBC Centre - Lillooet" },
                                            { id: "30-3", name: "WorkBC Centre - Ashcroft" },
                                            { id: "31-1", name: "WorkBC Centre - Kamloops - Lansdowne" },
                                            { id: "31-2", name: "WorkBC Centre - Kamloops - Tranquille" },
                                            { id: "31-3", name: "WorkBC Centre - Clearwater" },
                                            { id: "31-4", name: "WorkBC Centre - Barriere" },
                                            { id: "31-5", name: "WorkBC Centre - Chase" },
                                            { id: "32-1", name: "WorkBC Centre - Penticton" },
                                            { id: "32-2", name: "WorkBC Centre - Oliver" },
                                            { id: "32-3", name: "WorkBC Centre - Princeton" },
                                            { id: "32-4", name: "WorkBC Centre - Summerland" },
                                            { id: "33-1", name: "WorkBC Centre - Kelowna" },
                                            { id: "33-2", name: "WorkBC Centre - West Kelowna" },
                                            { id: "33-3", name: "WorkBC Centre - Rutland" },
                                            { id: "34-1", name: "WorkBC Centre - Salmon Arm" },
                                            { id: "34-2", name: "WorkBC Centre - Sicamous" },
                                            { id: "34-3", name: "WorkBC Centre - Golden" },
                                            { id: "34-4", name: "WorkBC Centre - Revelstoke" },
                                            { id: "35-1", name: "WorkBC Centre - Trail" },
                                            { id: "35-2", name: "WorkBC Centre - Castlegar" },
                                            { id: "35-3", name: "WorkBC Centre - Grand Forks" },
                                            { id: "36-1", name: "WorkBC Centre - Creston" },
                                            { id: "36-2", name: "WorkBC Centre - Nelson" },
                                            { id: "36-3", name: "WorkBC Centre - Nakusp" },
                                            { id: "37-1", name: "WorkBC Centre - Fernie" },
                                            { id: "37-2", name: "WorkBC Centre - Cranbrook" },
                                            { id: "37-3", name: "WorkBC Centre - Invermere" },
                                            { id: "38-1", name: "WorkBC Centre - Vernon" },
                                            { id: "38-2", name: "WorkBC Centre - Enderby" },
                                            { id: "39-1", name: "WorkBC Centre - Prince Rupert - Market" },
                                            { id: "39-2", name: "WorkBC Centre - Masset" },
                                            { id: "39-3", name: "WorkBC Centre - Queen Charlotte" },
                                            { id: "40-1", name: "WorkBC Centre - Terrace - 1st Ave" },
                                            { id: "40-2", name: "WorkBC Centre - Kitimat" },
                                            { id: "41-1", name: "WorkBC Centre - Smithers" },
                                            { id: "41-2", name: "WorkBC Centre - Hazelton" },
                                            { id: "42-1", name: "WorkBC Centre - Vanderhoof" },
                                            { id: "42-2", name: "WorkBC Centre - Fort St James" },
                                            { id: "42-3", name: "WorkBC Centre - Burns Lake" },
                                            { id: "43-1", name: "WorkBC Centre - Valemount" },
                                            { id: "43-2", name: "WorkBC Centre - Prince George" },
                                            { id: "43-3", name: "WorkBC Centre - Mackenzie" },
                                            { id: "44-1", name: "WorkBC Centre - Fort St John" },
                                            { id: "44-2", name: "WorkBC Centre - Fort Nelson" },
                                            { id: "45-1", name: "WorkBC Centre - Dawson Creek" },
                                            { id: "45-2", name: "WorkBC Centre - Chetwynd" }
                                        ]}
                                    />
                                    <Box sx={{ display: "flex", alignItems: "center", height: "3.5em" }}>
                                        <SaveButton icon={<span />} alwaysEnable sx={SaveButtonStyles} />
                                        <ModalButton
                                            text="CANCEL"
                                            showIcon={false}
                                            onClick={onRequestClose}
                                            ariaLabel="Close dialog"
                                        />
                                    </Box>
                                </Stack>
                            </Stack>
                        </Stack>
                    </SimpleForm>
                </BCGovModal>
            )}
        </>
    )
}

export default UserProfileModal
