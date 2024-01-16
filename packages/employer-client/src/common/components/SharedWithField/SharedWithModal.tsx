import { Box, List, ListItem } from "@mui/material"
import BCGovModal from "../BCGovModal/BCGovModal"
import { COLOURS } from "../../../Colours"
import ModalButton from "../BCGovModal/BCGovModalButton"

interface SharedWithModalProps {
    isOpen: boolean
    onRequestClose: (event: any) => void
    contentLabel: string
    formId: string
    sharedUsers: string[]
    resource: string
}

export const SharedWithModal: React.FC<SharedWithModalProps> = ({
    isOpen,
    onRequestClose,
    contentLabel,
    formId,
    sharedUsers,
    resource
}) => {
    return (
        <BCGovModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={contentLabel}>
            <Box>
                <h4>
                    {resource === "applications" ? "Application" : "Claim"} {formId} is shared with:
                </h4>
                <List
                    style={{
                        minHeight: "5em",
                        maxHeight: "20em",
                        overflow: "auto",
                        border: "2px solid " + COLOURS.MEDIUMGREY
                    }}
                >
                    {sharedUsers.map((user) => (
                        <ListItem key={user}>{user}</ListItem>
                    ))}
                </List>
            </Box>
            <Box width="100%" textAlign="right" paddingTop="1em">
                <ModalButton text="OK" showIcon={false} onClick={onRequestClose} ariaLabel="Close dialog" />
            </Box>
        </BCGovModal>
    )
}
