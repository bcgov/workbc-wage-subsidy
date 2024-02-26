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
import { useContext, useEffect, useState } from "react"
import { Box } from "@mui/system"
import { Stack } from "@mui/material"
import StyledTextInput from "./common/components/Forms/Fields/StyledTextInput"
import StyledSelectInput from "./common/components/Forms/Fields/StyledSelectInput"
import { useMutation } from "react-query"
import { EmployerContext } from "./common/contexts/EmployerContext"

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
    const [userProfile, setUserProfile] = useState<any>(null)
    const [create] = useCreate()
    const [loading, setLoading] = useState(false)
    const ec = useContext(EmployerContext)

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
                    bceid_business_name: identity.businessName || null,
                    bceid_username: identity.idpUsername
                }
            },
            {
                onSuccess: () => {
                    ec.setEmployerProfileExists(true)
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
        if (isOpen && identity && ec.profileExists) {
            getProfile(identity.guid)
        }
    }, [isOpen, ec.profileExists])

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
                                        validate={regex(
                                            /^\d{10}/,
                                            "Enter in the format: 1112223333"
                                        )}
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
                                        validate={regex(
                                            /^\d{10}/,
                                            "Enter in the format: 1112223333"
                                        )}
                                    />
                                    <StyledTextInput
                                        source="cra_business_number"
                                        label="CRA Business Number"
                                        sx={{ minWidth: "20em" }}
                                        validate={regex(
                                            /^[0-9]{9}[A-Z]{2}[0]{3}[1]/,
                                            "Enter in the format: 123456789BC0001"
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
                                <Box sx={{ width: "100%", display: "flex", justifyContent: "right" }}>
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
                    </SimpleForm>
                </BCGovModal>
            )}
        </>
    )
}

export default UserProfileModal
