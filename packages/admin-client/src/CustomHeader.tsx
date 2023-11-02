import { AppBar, AppBarProps, Box, Link, MenuItem, Toolbar } from "@mui/material"
import { styled } from "@mui/material/styles"
import ExitIcon from "@mui/icons-material/PowerSettingsNew"
import { HorizontalMenu, useContainerLayout } from "@react-admin/ra-navigation"
import React from "react"
import { LoadingIndicator, LocalesMenuButton, TitleComponent, UserMenu, useLocales, useLogout } from "react-admin"
import { Link as RouterLink } from "react-router-dom"
import Logo from "./Logo"
import Tag from "./Tag"

export const Header = (props: HeaderProps) => {
    const { menu = defaultMenu, toolbar = defaultToolbar, userMenu = CustomUserMenu() } = useContainerLayout(props)

    return (
        <>
            <Root1 position="static" color="primary" className={HeaderClasses.root} {...sanitizeRestProps(props)}>
                <Toolbar variant="dense" className={HeaderClasses.toolbar}>
                    <Box display="flex" alignItems="center">
                        <Box display="flex" gap={1} alignItems="center" minWidth="30em">
                            <Logo />
                            <Tag />
                            <Link
                                component={RouterLink}
                                to="/"
                                variant="h6"
                                color="primary.contrastText"
                                underline="none"
                                aria-label="WorkBC Wage Subsidy Application"
                            >
                                <b>WorkBC Wage Subsidy</b>
                            </Link>
                        </Box>
                    </Box>
                    <Box display="flex">
                        {toolbar}
                        {typeof userMenu === "boolean" ? userMenu === true ? <CustomUserMenu /> : null : userMenu}
                    </Box>
                </Toolbar>
            </Root1>
            <Root2
                position="static"
                color="secondary"
                className={HeaderClasses.root}
                sx={{
                    height: 48,
                    borderBottom: "0px"
                }}
                {...sanitizeRestProps(props)}
            >
                <Toolbar
                    variant="dense"
                    className={HeaderClasses.toolbar}
                    sx={{
                        "& .MuiTab-root": {
                            // Do not default to all uppercase.
                            textTransform: "none"
                        }
                    }}
                >
                    <Box>{menu}</Box>
                </Toolbar>
            </Root2>
        </>
    )
}

const PREFIX = "RaHeader"
export const HeaderClasses = {
    root: `${PREFIX}-root`,
    toolbar: `${PREFIX}-toolbar`
}

const Root1 = styled(AppBar, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root
})({
    [`& .${HeaderClasses.toolbar}`]: {
        flex: 1,
        justifyContent: "space-between"
    }
})

const Root2 = styled(AppBar, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root
})({
    [`& .${HeaderClasses.toolbar}`]: {
        flex: 1,
        justifyContent: "space-between"
    }
})

const defaultMenu = <HorizontalMenu />

const CustomUserMenu = () => {
    const logout = useLogout()
    return (
        <UserMenu>
            <MenuItem
                onClick={() => {
                    localStorage.removeItem("token")
                    localStorage.removeItem("refresh_token")
                    localStorage.removeItem("permissions")
                    localStorage.removeItem("access")
                    localStorage.clear()
                    logout()
                }}
            >
                <ExitIcon /> Logout
            </MenuItem>
        </UserMenu>
    )
}

const sanitizeRestProps = ({ title, menu, userMenu, toolbar, ...props }: any) => props

const DefaultToolbar = () => {
    const locales = useLocales()
    return (
        <>
            {locales && locales.length > 1 && <LocalesMenuButton />}
            <LoadingIndicator />
        </>
    )
}

const defaultToolbar = <DefaultToolbar />

export interface HeaderProps extends Omit<AppBarProps, "title"> {
    menu?: React.ReactNode
    title?: TitleComponent
    toolbar?: React.ReactNode
    userMenu?: React.ReactNode
}
