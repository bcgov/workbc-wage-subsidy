import { ReactKeycloakProvider } from "@react-keycloak/web"
import Keycloak from "keycloak-js"
import React, { useState } from "react"
import { Admin, Resource } from "react-admin"
import "./App.css"
import { ApplicationCreate } from "./Applications/ApplicationCreate"
import { ApplicationList } from "./Applications/ApplicationList"
import useAuthProvider from "./Auth/authProvider"
import { CreateClaim } from "./Claims/Create"
import { ClaimList } from "./Claims/List"
import { dataProvider } from "./DataProvider/DataProvider"
import Ready from "./Admin/ready"
import Footer from "./footer"
import Layout from "./Layout"
import { ApplicationShow } from "./Applications/ApplicationsShow"
import { ClaimEdit } from "./Claims/ClaimEdit"
import { Box } from "@mui/material"
import Logo from "./Logo"
import Tag from "./Tag"

const initOptions = {
    url: process.env.REACT_APP_KEYCLOAK_URL || "",
    realm: process.env.REACT_APP_KEYCLOAK_REALM || "",
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || ""
}

let keycloak = new Keycloak(initOptions)

const onToken = () => {
    console.log("onToken!")
    console.log(keycloak.token)
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
                    color: "#fff",
                    backgroundColor: "#003366",
                    borderBottom: "3px solid #FCBA19"
                },
                colorSecondary: {
                    color: "#fff",
                    indicatorColor: "#FCBA19",
                    backgroundColor: "#395889",
                    borderBottom: "3px solid #FCBA19"
                }
            }
        }
    },
    palette: {
        secondary: {
            main: "#FCBA19"
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
                    <Resource name="claims" list={ClaimList} edit={ClaimEdit} create={CreateClaim} />
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
