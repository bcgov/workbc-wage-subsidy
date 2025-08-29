import React from "react"
import { Logout, useLogout, UserMenu, useUserMenu } from "react-admin"
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
        <MenuItem onClick={handleClick} tabIndex={0}>
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

const handleClickOutside = () => {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: centerX,
        clientY: centerY
    })
    document.dispatchEvent(clickEvent)
}

export const CustomUserMenu: React.FC<CustomUserMenuProps> = ({ openModal }) => {
    const logout = useLogout()
    return (
        <UserMenu>
            <EditProfileMenuItem openModal={openModal} />
            {/* <Logout icon={<FontAwesomeIcon icon={faPowerOff} size="lg" style={{ color: "black" }} tabIndex={0} />} /> */}
            <Logout
                icon={<FontAwesomeIcon icon={faPowerOff} size="lg" style={{ color: "black" }} tabIndex={0} />}
                onClick={() => {
                    handleClickOutside()
                    logout()
                }}
            />
        </UserMenu>
    )
}
