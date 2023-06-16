import { ReactKeycloakProvider } from "@react-keycloak/web"
import Keycloak from "keycloak-js"
import React, { useState } from "react"
import { Admin, Resource } from "react-admin"
import { Box } from "@mui/material"
import "./App.css"
import { COLOURS } from "./Colours"
import { ApplicationList } from "./Applications/ApplicationList"
import { ApplicationCreate } from "./Applications/ApplicationCreate"
import { ApplicationShow } from "./Applications/ApplicationShow"
import useAuthProvider from "./Auth/authProvider"
import { ClaimList } from "./Claims/ClaimList"
import { ClaimCreate } from "./Claims/ClaimCreate"
import { ClaimEdit } from "./Claims/ClaimEdit"
import { dataProvider } from "./DataProvider/DataProvider"
import Ready from "./Admin/ready"
import Footer from "./footer"
import Layout from "./Layout"
import Logo from "./Logo"
import Tag from "./Tag"

const initOptions = {
    url: process.env.REACT_APP_KEYCLOAK_URL || "",
    realm: process.env.REACT_APP_KEYCLOAK_REALM || "",
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || ""
}

let keycloak = new Keycloak(initOptions)

const onToken = () => {
    if (keycloak.token && keycloak.refreshToken) {
        localStorage.setItem("token", keycloak.token)
        localStorage.setItem("refresh-token", keycloak.refreshToken)
        localStorage.setItem("provider", keycloak.idTokenParsed?.identity_provider)
        window.dispatchEvent(new Event("storage"))
    }
}

const onTokenExpired = () => {
    keycloak
        .updateToken(30)
        .then(() => {
            console.log("successfully got a new token", keycloak.token)
            if (keycloak.token && keycloak.refreshToken) {
                localStorage.setItem("token", keycloak.token)
                localStorage.setItem("refresh-token", keycloak.refreshToken)
                localStorage.setItem("provider", keycloak.idTokenParsed?.identity_provider)
                window.dispatchEvent(new Event("storage"))
            }
        })
        .catch(() => {
            console.error("failed to refresh token")
        })
}

export const lightTheme = {
    components: {
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    color: COLOURS.WHITE,
                    backgroundColor: COLOURS.DARKBLUE,
                    borderBottom: `3px solid ${COLOURS.BC_GOLD}`
                },
                colorSecondary: {
                    color: COLOURS.WHITE,
                    indicatorColor: COLOURS.BC_GOLD,
                    backgroundColor: COLOURS.BC_BLUE,
                    borderBottom: `3px solid ${COLOURS.BC_GOLD}`
                }
            }
        },
        MuiChip: {
            textAlign: "center",
            styleOverrides: {
                textAlign: "center",
                colorSuccess: {
                    color: COLOURS.WHITE
                }
            }
        },
        RaCreateButton: {
            styleOverrides: {
                "& .RaCreateButton-root": {
                    textColor: COLOURS.WHITE,
                    backgroundColor: COLOURS.BC_DARKBLUE,
                    fontWeight: "bold",
                    marginBottom: 2
                },
                root: {
                    color: COLOURS.WHITE,
                    backgroundColor: COLOURS.BC_DARKBLUE,
                    fontWeight: "bold",
                    marginBottom: 2,
                    "&:hover": {
                        color: COLOURS.WHITE,
                        backgroundColor: COLOURS.LIGHTBLUE
                    },
                    borderRadius: 20,
                    minWidth: 180
                }
            }
        },
        RaDatagrid: {
            styleOverrides: {
                root: {
                    "& .RaDatagrid-checkbox": {
                        color: COLOURS.DARKBLUE
                    },
                    "& .RaDatagrid-headerCell": {
                        "& .MuiCheckbox-root": {
                            color: COLOURS.DARKBLUE
                        }
                    }
                }
            }
        },
        RaBulkActionsToolbar: {
            styleOverrides: {
                root: {
                    "& .RaBulkActionsToolbar-toolbar": {
                        backgroundColor: "#d7f0fa",
                        color: "#3a86e3"
                    }
                }
            }
        }
    },
    palette: {
        primary: {
            main: "#0745a3"
        },
        secondary: {
            main: COLOURS.BC_GOLD
        },
        info: {
            main: COLOURS.LIGHTBLUE
        },
        warning: {
            main: COLOURS.BC_DARKBLUE
        },
        success: {
            main: "#75b404"
        },
        error: {
            main: "#e5e8ef"
        }
    }
}

const CustomAdminWithKeycloak = () => {
    const customAuthProvider = useAuthProvider(process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "")
    const [permissions, setPermissions] = useState(keycloak.idTokenParsed?.identity_provider === "bceid")
    React.useEffect(() => {
        if (keycloak && keycloak.idTokenParsed?.identity_provider === "bceidboth") {
            setPermissions(true)
        }
    }, [])
    return (
        <Admin
            theme={lightTheme}
            dataProvider={dataProvider}
            authProvider={customAuthProvider}
            loginPage={false}
            layout={Layout}
            disableTelemetry
            requireAuth
            ready={Ready}
            title={
                <Box display="flex" gap={1} alignItems="center">
                    <Logo />
                    <Tag />
                    <b>WorkBC Wage Subsidy</b>
                </Box>
            }
        >
            {permissions && (
                <>
                    <Resource
                        name="wage"
                        options={{ label: "Applications" }}
                        list={ApplicationList}
                        create={ApplicationCreate}
                        show={ApplicationShow}
                    />
                    <Resource name="claims" list={ClaimList} edit={ClaimEdit} create={ClaimCreate} />
                </>
            )}
        </Admin>
    )
}

function App() {
    return (
        <ReactKeycloakProvider
            authClient={keycloak}
            LoadingComponent={<div></div>}
            onTokens={onToken}
            initOptions={{
                onLoad: "login-required",
                pkceMethod: "S256",
                onTokenExpired: onTokenExpired
            }}
        >
            <CustomAdminWithKeycloak />
            <Footer />
        </ReactKeycloakProvider>
    )
}

export default App
