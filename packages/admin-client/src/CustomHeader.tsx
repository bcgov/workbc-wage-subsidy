import { AppBar, AppBarProps, Box, Link, Toolbar, Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import { HorizontalMenu, useContainerLayout } from "@react-admin/ra-navigation"
import React, { useState } from "react"
import { LoadingIndicator, LocalesMenuButton, TitleComponent, UserMenu, useLocales } from "react-admin"
import { Link as RouterLink } from "react-router-dom"
import Logo from "./Logo"
import Tag from "./Tag"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEyeLowVision } from "@fortawesome/pro-solid-svg-icons"
import BCGovModal from "./common/components/BCGovModal/BCGovModal"

export const Header = (props: HeaderProps) => {
    const { menu = defaultMenu, toolbar = defaultToolbar, userMenu = defaultUserMenu } = useContainerLayout(props)
    const [accessibilityFeaturesModalIsOpen, setAccessibilityFeaturesModalIsOpen] = useState(false)

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
                        {typeof userMenu === "boolean" ? userMenu === true ? <UserMenu /> : null : userMenu}
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
                    <Button
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            cursor: "pointer",
                            fontSize: "14px",
                            color: "rgb(255, 255, 255)",
                            textTransform: "none",
                            ":hover": {
                                textDecoration: "underline"
                            }
                        }}
                        onClick={() => setAccessibilityFeaturesModalIsOpen(true)}
                    >
                        <FontAwesomeIcon icon={faEyeLowVision} size="2x" style={{ marginRight: 15 }} />
                        Accessibility Features
                    </Button>
                </Toolbar>
            </Root2>
            <BCGovModal
                isOpen={accessibilityFeaturesModalIsOpen}
                onRequestClose={() => setAccessibilityFeaturesModalIsOpen(false)}
                contentLabel="Accessibility Features"
            >
                <div className="accessibility-features-modal-container">
                    <div className="accessibility-features-title">
                        <h1>Accessibility Features</h1>
                        <div>
                            The Wage Subsidy application has been developed following the BC Government's{" "}
                            <a
                                href="https://www2.gov.bc.ca/gov/content/home/accessible-government/toolkit"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Accessibility and Inclusion Toolkit
                            </a>
                            , and specifically the{" "}
                            <a href="https://www.w3.org/WAI/tips/developing/">W3 Developing for Web Accessibility</a>{" "}
                            best practices.
                        </div>
                    </div>
                    <div className="accessiblity-features-content">
                        <h2>Form Completion</h2>
                        <div>
                            For applications and claim forms, we use embedded form functionality within the Wage Subsidy
                            application. For screen readers, use the 'Open form in new tab' icon link to allow your
                            screen reader to properly read out and allow you to work with form fields.
                        </div>
                        <h2>Labels and tool tips</h2>
                        <div>
                            Labels and tool tips have been added to provide additional explanation for areas, fields and
                            actions within the application. Some of these labels may be hidden visually but will be read
                            out with screen readers.
                        </div>
                        <h2>Navigation</h2>
                        <div>
                            Users can navigate between the list of applications or claim forms and the status filter
                            sidebar (left-hand portion of the screen) using the left and right arrow keys.
                        </div>
                        <h2>Checkboxes</h2>
                        <div>
                            Selecting a given checkbox will enable additional actions to appear at the top of the list
                            of applications or claim forms. <br />
                            <br />
                            For Employers, this action allows the user to <b>share</b> selected applications and claim
                            forms with others within your Business BCeID organization. Note this function is not
                            available for Basic BCeID users. <br />
                            <br />
                            For Ministry Staff, this action allows the user to <b>move</b> applications and claim forms
                            from one catchment to another.
                        </div>
                    </div>
                </div>
            </BCGovModal>
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
const defaultUserMenu = <UserMenu />

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
