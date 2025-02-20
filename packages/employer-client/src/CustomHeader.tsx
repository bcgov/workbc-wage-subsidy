import React, { useCallback, useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Toolbar, AppBar, AppBarProps, Box, Link, Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import { UserMenu, LoadingIndicator, LocalesMenuButton, TitleComponent, useLocales } from "react-admin"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpenReader, faEyeLowVision } from "@fortawesome/pro-solid-svg-icons"
import { useContainerLayout, HorizontalMenu } from "@react-admin/ra-navigation"
import Logo from "./Logo"
import Tag from "./Tag"
import { CustomUserMenu } from "./CustomUserMenu"
import UserProfileModal from "./UserProfileModal"
import EmployerHandbook from "./assets/Wage-Subsidy-Handbook.pdf"
import BCGovModal from "./common/components/BCGovModal/BCGovModal"

export const Header = (props: HeaderProps) => {
    const { menu = defaultMenu, toolbar = defaultToolbar, userMenu = defaultUserMenu } = useContainerLayout(props)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [accessibilityFeaturesModalIsOpen, setAccessibilityFeaturesModalIsOpen] = useState(false)

    const openModal = useCallback(() => {
        setModalIsOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        setModalIsOpen(false)
    }, [])

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
                        {typeof userMenu === "boolean" ? (
                            userMenu === true ? (
                                <CustomUserMenu openModal={openModal} />
                            ) : null
                        ) : (
                            userMenu
                        )}
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
                    <div style={{ display: "flex", flexDirection: "row" }}>
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
                            onClick={() => window.open(EmployerHandbook)}
                        >
                            <FontAwesomeIcon icon={faBookOpenReader} size="2x" style={{ marginRight: 15 }} />
                            Employer Handbook
                        </Button>
                    </div>
                </Toolbar>
            </Root2>
            {/* Mount modal outside of CustomUserMenu. */}
            {/* Then menu can close when modal opens, allowing modal to receive focus. */}
            <UserProfileModal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Update user profile" />
            <BCGovModal
                isOpen={accessibilityFeaturesModalIsOpen}
                onRequestClose={() => setAccessibilityFeaturesModalIsOpen(false)}
                contentLabel="Accessibility Features"
            >
                <div className="accessibility-features-modal-container">
                    <div className="accessibility-features-title">
                        <h1>Accessibility Features</h1>
                        <div>
                            The Wage Subsidy application has been developed following the BC Government's
                            <a
                                href="https://www2.gov.bc.ca/gov/content/home/accessible-government/toolkit"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {" "}
                                Accessibility and Inclusion Toolkit
                            </a>
                            , and specifically the
                            <a href="https://www.w3.org/WAI/tips/developing/" target="_blank" rel="noreferrer">
                                {" "}
                                W3 Developing for Web Accessibility
                            </a>{" "}
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
                        <h2>Labels and Tool Tips</h2>
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
