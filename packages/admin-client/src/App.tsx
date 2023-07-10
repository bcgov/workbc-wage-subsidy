import { Box } from "@mui/material"
import { ReactKeycloakProvider } from "@react-keycloak/web"
import axios from "axios"
import Keycloak from "keycloak-js"
import { useContext, useEffect, useState } from "react"
import { Admin, Resource } from "react-admin"
import Ready from "./Admin/ready"
import "./App.css"
import { ApplicationList } from "./Applications/ApplicationList"
import useAuthProvider from "./Auth/authProvider"
import { ClaimsEdit } from "./Claims/ClaimsEdit"
import { ClaimsList } from "./Claims/ClaimsList"
import { COLOURS } from "./Colours"
import { dataProvider } from "./DataProvider/DataProvider"
import Footer from "./Footer"
import Layout from "./Layout"
import Logo from "./Logo"
import Tag from "./Tag"
import { CatchmentContext, CatchmentProvider } from "./common/contexts/CatchmentContext/CatchmentContext"

const initOptions = {
    url: process.env.REACT_APP_KEYCLOAK_URL || "",
    realm: process.env.REACT_APP_KEYCLOAK_REALM || "",
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || ""
}

const keycloak = new Keycloak(initOptions)

const toTitleCase = (str: string) => {
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

const parseCatchments = (permissions: any[]) => {
    // Extract catchment number and location. Remove leading '1'.
    // Remove null and non-numeric catchment numbers.
    // Sort in ascending order.
    return permissions
        .map((item: any) => {
            return {
                catchmentNo: Number(item.Catchment.slice(1)),
                location: toTitleCase(item.CatchmentDescription)
            }
        })
        .filter((item: any) => item.catchmentNo != null && !Number.isNaN(item.catchmentNo))
        .sort((item1: any, item2: any) => item1.catchmentNo - item2.catchmentNo)
}

const onToken = async () => {
    if (keycloak.token && keycloak.refreshToken) {
        localStorage.setItem("token", keycloak.token)
        localStorage.setItem("refresh-token", keycloak.refreshToken)
    }
    const res = await axios.get(`${process.env.REACT_APP_ADMIN_API_URL || "http://localhost:8002"}/permission`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    localStorage.setItem("provider", res.data.provider)
    localStorage.setItem("permissions", JSON.stringify(parseCatchments(res.data.permissions)))
    localStorage.setItem("access", res.data.access)
    window.dispatchEvent(new Event("storage"))
}

const onTokenExpired = () => {
    keycloak
        .updateToken(30)
        .then(async () => {
            onToken()
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
    const [access, setAccess] = useState(localStorage.getItem("access") === "true")
    const catchmentContext = useContext(CatchmentContext)
    const customAuthProvider = useAuthProvider()

    useEffect(() => {
        // When token refreshes, update local 'access' variable used to conditionally render app.
        window.addEventListener("storage", () => {
            setAccess(localStorage.getItem("access") === "true")
        })
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
                <Box display="flex" gap={1} alignItems="center" minWidth="25em">
                    <Logo />
                    <Tag />
                    <b>WorkBC Wage Subsidy</b>
                </Box>
            }
        >
            {access && catchmentContext.catchments.length > 0 && (
                <>
                    <Resource name="applications" options={{ label: "Applications" }} list={ApplicationList} />
                    <Resource name="claims" list={ClaimsList} edit={ClaimsEdit} />
                </>
            )}
        </Admin>
    )
}

function App() {
    return (
        <ReactKeycloakProvider
            authClient={keycloak}
            LoadingComponent={<div />}
            onTokens={onToken}
            initOptions={{
                onLoad: "login-required",
                pkceMethod: "S256",
                onTokenExpired
            }}
        >
            <>
                <CatchmentProvider>
                    <CustomAdminWithKeycloak />
                    <Footer />
                </CatchmentProvider>
            </>
        </ReactKeycloakProvider>
    )
}

export default App
