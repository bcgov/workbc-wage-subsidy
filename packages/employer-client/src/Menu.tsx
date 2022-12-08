import * as React from "react"
import { useState } from "react"
import Box from "@mui/material/Box"
import LabelIcon from "@mui/icons-material/Label"

import { useTranslate, DashboardMenuItem, MenuItemLink, MenuProps, useSidebarState } from "react-admin"

type MenuName = "BCGov Forms"

const Menu = ({ dense = false }: MenuProps) => {
    const [state, setState] = useState({
        menuCatalog: true,
        menuSales: true,
        menuCustomers: true
    })
    const translate = useTranslate()
    const [open] = useSidebarState()

    const handleToggle = (menu: MenuName) => {
        setState((state) => ({ ...state, [menu]: !state[menu] }))
    }

    return (
        <Box
            sx={{
                width: open ? 200 : 50,
                marginTop: 1,
                marginBottom: 1,
                transition: (theme) =>
                    theme.transitions.create("width", {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen
                    })
            }}
        ></Box>
    )
}

export default Menu
