import BCGovModal from "./common/components/BCGovModal/BCGovModal"
import ModalButton from "./common/components/BCGovModal/BCGovModalButton"
import { SaveButton, SimpleForm, useDataProvider, useGetIdentity } from "react-admin"
import { useEffect, useState } from "react"
import { Box } from "@mui/system"
import { Stack } from "@mui/material"
import StyledTextInput from "./common/components/Forms/Fields/StyledTextInput"
import StyledSelectInput from "./common/components/Forms/Fields/StyledSelectInput"

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
    const [profileExists, setProfileExists] = useState<boolean>(false)
    const [userProfile, setUserProfile] = useState<any>(null)

    const getProfile = (userGuid: string) => {
        dataProvider.getOne("employers", { id: userGuid }).then(({ data }) => {
            setUserProfile(data)
        })
    }

    const saveProfile = (data: any) => {
        const { id: userGuid, ...formData } = data
        dataProvider.update("employers", { id: userGuid, data: formData, previousData: undefined }).then(({ data }) => {
            onRequestClose(null)
        })
    }

    const createOrUpdateProfile = (identity: any) => {
        dataProvider
            .createOrUpdate("employers", {
                // Extract user data from token.
                id: identity.guid,
                data: {
                    contact_name: identity?.fullName || null,
                    contact_email: identity?.email || null,
                    bceid_business_guid: identity?.businessGuid || null,
                    bceid_business_name: identity?.businessName || null
                }
            })
            .then(({ data }) => {
                setProfileExists(true)
            })
    }

    useEffect(() => {
        if (isOpen && identity && profileExists) {
            getProfile(identity.guid)
        }
    }, [isOpen, profileExists])

    useEffect(() => {
        if (identity) {
            createOrUpdateProfile(identity)
        }
    }, [identity])

    return (
        <>
            {userProfile && (
                <BCGovModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={contentLabel}>
                    <h2>Edit Profile</h2>
                    <SimpleForm
                        resource="employers"
                        record={userProfile}
                        onSubmit={saveProfile}
                        toolbar={false}
                        sx={{ padding: "0em 0em" }}
                    >
                        <Stack direction="column" spacing={0} paddingTop="2em">
                            <Stack direction="column" spacing={2}>
                                <Stack direction="row" spacing={6}>
                                    <StyledTextInput
                                        source="bceid_business_name"
                                        label="Employer Name (Business Name)"
                                        sx={{ minWidth: "20em" }}
                                        disabled
                                    />
                                    <StyledTextInput
                                        source="contact_name"
                                        label="Employer Contact"
                                        sx={{ minWidth: "20em" }}
                                        disabled
                                    />
                                </Stack>
                                <Stack direction="row" spacing={6}>
                                    <StyledTextInput
                                        source="phone_number"
                                        label="Phone Number"
                                        sx={{ minWidth: "20em" }}
                                    />
                                    <StyledTextInput
                                        source="contact_email"
                                        label="Employer Email Address"
                                        sx={{ minWidth: "20em" }}
                                        disabled
                                    />
                                </Stack>
                                <Stack direction="row" spacing={6}>
                                    <StyledTextInput source="fax_number" label="Fax Number" sx={{ minWidth: "20em" }} />
                                    <StyledTextInput
                                        source="cra_business_number"
                                        label="CRA Business Number"
                                        sx={{ minWidth: "20em" }}
                                    />
                                </Stack>
                            </Stack>
                            <Stack direction="column" spacing={2}>
                                <h3>Address</h3>
                                <StyledTextInput source="street_address" label="Address" sx={{ minWidth: "43em" }} />
                                <Stack direction="row" spacing={6}>
                                    <StyledTextInput source="city" label="City" sx={{ minWidth: "20em" }} />
                                    <StyledTextInput source="province" label="Province" sx={{ minWidth: "20em" }} />
                                </Stack>
                                <StyledTextInput source="postal_code" label="Postal Code" sx={{ maxWidth: "20em" }} />
                            </Stack>
                            <Stack direction="column" spacing={2}>
                                <h3>
                                    Workplace Address{" "}
                                    <span style={{ fontWeight: "normal" }}>(if different from above)</span>
                                </h3>
                                <StyledTextInput
                                    source="workplace_street_address"
                                    label="Address"
                                    sx={{ minWidth: "43em" }}
                                />
                                <Stack direction="row" spacing={6}>
                                    <StyledTextInput source="workplace_city" label="City" sx={{ minWidth: "20em" }} />
                                    <StyledTextInput
                                        source="workplace_province"
                                        label="Province"
                                        sx={{ minWidth: "20em" }}
                                    />
                                </Stack>
                                <StyledTextInput
                                    source="workplace_postal_code"
                                    label="Postal Code"
                                    sx={{ maxWidth: "20em" }}
                                />
                                <Stack direction="row" spacing={6}>
                                    <StyledSelectInput
                                        source="workbc_center"
                                        label="WorkBC Center"
                                        sx={{ minWidth: "32em" }}
                                        choices={[
                                            { id: "placeholder1", name: "Placeholder 1" },
                                            { id: "placeholder2", name: "Placeholder 2" },
                                            { id: "placeholder3", name: "Placeholder 3" }
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
