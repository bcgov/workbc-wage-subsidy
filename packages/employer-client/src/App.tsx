import "@bcgov/bc-sans/css/BCSans.css"
import { ReactKeycloakProvider } from "@react-keycloak/web"
import Keycloak from "keycloak-js"
import React, { useState } from "react"
import { Admin, CustomRoutes, Resource } from "react-admin"
import { Route } from "react-router-dom"
import { QueryClient } from "react-query"
import Ready from "./Admin/ready"
import "./App.css"
import { ApplicationCreate } from "./Applications/ApplicationCreate"
import { ApplicationList } from "./Applications/ApplicationList"
import useAuthProvider from "./Auth/authProvider"
import { ClaimCreate } from "./Claims/ClaimCreate"
import { ClaimCreateSelectApplication } from "./Claims/ClaimCreateSelectApplication"
import { ClaimList } from "./Claims/ClaimList"
import { COLOURS } from "./Colours"
import { dataProvider } from "./DataProvider/DataProvider"
import { ViewForm } from "./Form/ViewForm"
import Layout from "./Layout"
import Footer from "./footer"

const initOptions = {
    url: process.env.REACT_APP_KEYCLOAK_URL || "",
    realm: process.env.REACT_APP_KEYCLOAK_REALM || "",
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || ""
}

let keycloak = new Keycloak(initOptions)
const kcLogin = keycloak.login
keycloak.login = (options) => {
    if (options) options.idpHint = "bceid"
    return kcLogin(options)
}

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
        RaContainerLayout: {
            styleOverrides: {
                root: {
                    "& .MuiContainer-root": {
                        overflowX: "auto",
                        overflowY: "visible"
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
                    minWidth: 180,
                    fontSize: "14px"
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
    const customAuthProvider = useAuthProvider(process.env.REACT_APP_KEYCLOAK_CLIENT_ID ?? "")
    const [permissions, setPermissions] = useState(keycloak.idTokenParsed?.identity_provider === "bceid")
    React.useEffect(() => {
        if (
            (keycloak && keycloak.idTokenParsed?.identity_provider === "bceid") ||
            (keycloak && keycloak.idTokenParsed?.identity_provider === "bceidboth")
        ) {
            setPermissions(true)
        }
    }, [])

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: true,
                refetchOnMount: true,
                refetchOnReconnect: true
            },
            mutations: {
                retryDelay: 10000
            }
        }
    })

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
            queryClient={queryClient}
        >
            {permissions && (
                <>
                    <Resource
                        name="applications"
                        options={{ label: "Applications" }}
                        list={ApplicationList}
                        create={ApplicationCreate}
                    />
                    <Resource name="claims" options={{ label: "Claims" }} list={ClaimList} create={ClaimCreate}>
                        <Route path="create/SelectApplication" element={<ClaimCreateSelectApplication />} />
                    </Resource>
                    <CustomRoutes>
                        <Route path="ViewForm/:urlType/:resource/:formId" element={<ViewForm />} />
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
