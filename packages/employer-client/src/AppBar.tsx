import * as React from "react"
import { AppBar } from "react-admin"
import { Typography } from "@mui/material"
import Logo from "./Logo"
import Tag from "./Tag"

const CustomAppBar = (props: any) => {
    return (
        <AppBar {...props} color="secondary" elevation={1}>
            <Logo />
            <Tag />
            <Typography
                align="center"
                variant="h6"
                color="inherit"
                sx={{
                    flex: 1,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden"
                }}
                id="react-admin-title"
            />
        </AppBar>
    )
}

export default CustomAppBar
