import React from "react"
import { Logout, UserMenu, useUserMenu } from "react-admin"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserPen, faPowerOff } from "@fortawesome/pro-solid-svg-icons"

interface EditProfileMenuItemProps {
    openModal: () => void
}

const EditProfileMenuItem: React.FC<EditProfileMenuItemProps> = ({ openModal }) => {
    const { onClose } = useUserMenu()

    const handleClick = (event: any) => {
        onClose()
        openModal()
    }

    return (
        <MenuItem onClick={handleClick}>
            <ListItemIcon>
                <FontAwesomeIcon icon={faUserPen} size="lg" style={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText>Edit Profile</ListItemText>
        </MenuItem>
    )
}

interface CustomUserMenuProps {
    openModal: () => void
}

export const CustomUserMenu: React.FC<CustomUserMenuProps> = ({ openModal }) => (
    <UserMenu>
        <EditProfileMenuItem openModal={openModal} />
        <Logout icon={<FontAwesomeIcon icon={faPowerOff} size="lg" style={{ color: "black" }} />} />
    </UserMenu>
)
