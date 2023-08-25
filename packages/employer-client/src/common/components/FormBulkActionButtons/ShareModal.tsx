import { Box, Button, MenuItem, MenuList } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft } from "@fortawesome/pro-solid-svg-icons"
import { faAngleRight } from "@fortawesome/pro-solid-svg-icons"
import BCGovModal from "../BCGovModal/BCGovModal"
import { COLOURS } from "../../../Colours"
import ModalButton from "../BCGovModal/BCGovModalButton"
import React, { useEffect, useState } from "react"
import { ScreenReaderOnly } from "../../styles/ScreenReaderOnly"

interface UsersListProps {
    users: string[]
    selection: string[]
    setSelection: React.Dispatch<React.SetStateAction<string[]>>
    ariaLabel: string
}

const UsersList: React.FC<UsersListProps> = ({ users, selection, setSelection, ariaLabel }) => {
    const handleItemClick = (clickedItem: string) => {
        // Toggle selection of clicked item.
        if (selection.includes(clickedItem)) {
            setSelection(selection.filter((item) => item !== clickedItem))
        } else {
            setSelection([...selection, clickedItem])
        }
    }

    return (
        <MenuList
            tabIndex={0}
            aria-label={ariaLabel}
            style={{
                minHeight: "20em",
                maxHeight: "20em",
                overflow: "auto",
                border: "2px solid " + COLOURS.MEDIUMGREY
            }}
        >
            {users.map((user) => (
                <MenuItem
                    key={user}
                    value={user}
                    selected={selection.includes(user)}
                    onClick={() => handleItemClick(user)}
                >
                    {/* Manually indicate selection, since aria-selected having no effect for unknown reasons. */}
                    <span style={ScreenReaderOnly}>
                        {user + (selection.includes(user) ? ", selected" : ", unselected")}
                    </span>
                    <span aria-hidden={true}>{user}</span>
                </MenuItem>
            ))}
        </MenuList>
    )
}

interface AngleButtonProps {
    onClick: (event: any) => void
    direction: string
    ariaLabel: string
}

const AngleButton: React.FC<AngleButtonProps> = ({ onClick, direction, ariaLabel }) => {
    const icon = direction === "right" ? faAngleRight : faAngleLeft
    return (
        <Button
            onClick={onClick}
            sx={{ padding: "0.75em 0.75em", border: "2px solid " + COLOURS.MEDIUMGREY }}
            aria-label={ariaLabel}
        >
            <FontAwesomeIcon icon={icon} size="xl" color={COLOURS.MEDIUMGREY} />
        </Button>
    )
}

interface ShareModalProps {
    isOpen: boolean
    onRequestClose: (event: any) => void
    contentLabel: string
    selectedIds: any[]
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onRequestClose, contentLabel, selectedIds }) => {
    const [availableUsers, setAvailableUsers] = useState<string[]>([])
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [availableUsersSelection, setAvailableUsersSelection] = useState<string[]>([])
    const [selectedUsersSelection, setSelectedUsersSelection] = useState<string[]>([])

    const getAvailableUsers = () => {
        // TODO: fetch actual users.
        return ["test user 1", "test user 2"]
    }

    const shareWithSelectedUsers = (event: any) => {
        if (selectedUsers.length > 0) {
            // TODO: share selected forms with selected users.
        }
        onRequestClose(event)
    }

    const clearUsersLists = () => {
        setAvailableUsers([])
        setAvailableUsersSelection([])
        setSelectedUsers([])
        setSelectedUsersSelection([])
    }

    const addSelectedUsers = (users: any) => {
        setSelectedUsers([...selectedUsers, ...users].sort())
        setSelectedUsersSelection([...selectedUsersSelection, ...users])
    }

    const addAvailableUsers = (users: any) => {
        setAvailableUsers([...availableUsers, ...users].sort())
        setAvailableUsersSelection([...availableUsersSelection, ...users])
    }

    const removeSelectedUsers = (users: any) => {
        setSelectedUsers(selectedUsers.filter((item) => !users.includes(item)).sort())
        setSelectedUsersSelection([])
    }

    const removeAvailableUsers = (users: any) => {
        setAvailableUsers(availableUsers.filter((item) => !users.includes(item)).sort())
        setAvailableUsersSelection([])
    }

    const handleAngleRightButtonClick = (event: any) => {
        addSelectedUsers(availableUsersSelection)
        removeAvailableUsers(availableUsersSelection)
    }

    const handleAngleLeftButtonClick = (event: any) => {
        addAvailableUsers(selectedUsersSelection)
        removeSelectedUsers(selectedUsersSelection)
    }

    useEffect(() => {
        if (isOpen) {
            setAvailableUsers(getAvailableUsers())
        } else {
            clearUsersLists()
        }
    }, [isOpen])

    return (
        <BCGovModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={contentLabel}>
            <h2>Share with...</h2>
            <p>Note you may only share with members of your own Business BCeID Organization</p>
            <Box sx={{ display: "flex", width: "100%", justifyContent: "center", gap: "1em" }}>
                <Box sx={{ display: "flex", flexDirection: "column", width: "80%", lineHeight: "0.1em" }}>
                    <p>Available</p>
                    <UsersList
                        users={availableUsers}
                        selection={availableUsersSelection}
                        setSelection={setAvailableUsersSelection}
                        ariaLabel="available users"
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        paddingTop: "1.75em",
                        alignSelf: "center",
                        lineHeight: "2em",
                        gap: "1em"
                    }}
                >
                    <AngleButton
                        onClick={handleAngleRightButtonClick}
                        direction="right"
                        ariaLabel="add to selected users"
                    />
                    <AngleButton
                        onClick={handleAngleLeftButtonClick}
                        direction="left"
                        ariaLabel="remove from selected users"
                    />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", width: "80%", lineHeight: "0.1em" }}>
                    <p>Selected</p>
                    <UsersList
                        users={selectedUsers}
                        selection={selectedUsersSelection}
                        setSelection={setSelectedUsersSelection}
                        ariaLabel="selected users"
                    />
                </Box>
            </Box>
            <Box width="100%" textAlign="right" paddingTop="1em">
                <ModalButton
                    text="OK"
                    showIcon={false}
                    onClick={shareWithSelectedUsers}
                    ariaLabel="Share selected forms with selected users"
                />
                <ModalButton text="CANCEL" showIcon={false} onClick={onRequestClose} ariaLabel="Close dialog" />
            </Box>
        </BCGovModal>
    )
}

export default ShareModal
