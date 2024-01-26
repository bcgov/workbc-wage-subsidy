import { ReactKeycloakProvider } from "@react-keycloak/web"
import axios from "axios"
import Keycloak from "keycloak-js"
import { useEffect, useState } from "react"
import { Admin, CustomRoutes, Resource } from "react-admin"
import Ready from "./admin/ready"
import "./App.css"
import { ApplicationList } from "./Applications/ApplicationList"
import useAuthProvider from "./Auth/authProvider"
import { ClaimList } from "./Claims/ClaimList"
import { COLOURS } from "./Colours"
import { dataProvider } from "./DataProvider/DataProvider"
import Footer from "./Footer"
import Layout from "./Layout"
import { CatchmentProvider } from "./common/contexts/CatchmentContext/CatchmentContext"
import "@bcgov/bc-sans/css/BCSans.css"
import { Route } from "react-router-dom"
import { ViewForm } from "./Form/ViewForm"
import { parseCatchments } from "./utils/parseCatchments"

const initOptions = {
    url: process.env.REACT_APP_KEYCLOAK_URL || "",
    realm: process.env.REACT_APP_KEYCLOAK_REALM || "",
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || ""
}

const keycloak = new Keycloak(initOptions)

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
        RaLoadingIndicator: {
            styleOverrides: {
                root: {
                    "& .RaLoadingIndicator-loadedIcon": {
                        height: "100%",
                        border: "2px solid transparent",
                        "&:hover": {
                            border: "2px solid white",
                            backgroundColor: "transparent"
                        }
                    }
                }
            }
        },
        RaUserMenu: {
            styleOverrides: {
                root: {
                    "& .RaUserMenu-userButton": {
                        height: "100%",
                        border: "2px solid transparent",
                        "&:hover": {
                            border: "2px solid white",
                            backgroundColor: "transparent"
                        }
                    }
                }
            }
        },
        RaContainerLayout: {
            styleOverrides: {
                root: {
                    "& .MuiContainer-root": {
                        overflowX: "auto",
                        overflowY: "visible",
                        display: "block"
                    }
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
        MuiToolbar: {
            styleOverrides: {
                root: {
                    "& .MuiTab-root": {
                        "&:hover": {
                            textDecoration: "underline"
                        }
                    }
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
        RaBulkActionsToolbar: {
            styleOverrides: {
                root: {
                    "& .RaBulkActionsToolbar-toolbar": {
                        backgroundColor: "#d7f0fa",
                        color: "#3a86e3"
                    },
                    "& .MuiButton-root": {
                        color: "#3a86e3"
                    }
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    verticalAlign: "top",
                    marginTop: "1em"
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
            main: "#E5412C"
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
    },
    typography: {
        fontFamily: ['"BCSans"', '"Noto Sans"', "Verdana", "Arial", "sans-serif"].join(",")
    }
}

const CustomAdminWithKeycloak = () => {
    const [access, setAccess] = useState(localStorage.getItem("access") === "true")
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
        >
            {access && (
                <>
                    <Resource name="applications" options={{ label: "Applications" }} list={ApplicationList} />
                    <Resource name="claims" options={{ label: "Claims" }} list={ClaimList} />
                    <CustomRoutes>
                        <Route path="ViewForm/:resource/:recordId" element={<ViewForm />} />
                    </CustomRoutes>
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
                onTokenExpired,
                checkLoginIframe: false
            }}
        >
            <CatchmentProvider>
                <CustomAdminWithKeycloak />
                <Footer />
            </CatchmentProvider>
        </ReactKeycloakProvider>
    )
}

export default App
