/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { ReactKeycloakProvider } from "@react-keycloak/web"
import Keycloak from "keycloak-js"
import { Admin, Resource } from "react-admin"
import jwt_decode from "jwt-decode"
import useAuthProvider from "./Auth/authProvider"
import Footer from "./admin/footer"
import Layout from "./admin/Layout"
import "./App.css"
import { ClaimsEdit } from "./Claims/ClaimsEdit"
import { ClaimsList } from "./Claims/ClaimsList"
import { dataProvider } from "./DataProvider/DataProvider"
import { WageList } from "./Wage/WageList"
import LoginPage from "./Auth/LoginPage"

const initOptions = {
    url: process.env.REACT_APP_KEYCLOAK_URL || "",
    realm: process.env.REACT_APP_KEYCLOAK_REALM || "",
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || ""
}

const keycloak = new Keycloak(initOptions)

const onToken = () => {
    if (keycloak.token && keycloak.refreshToken) {
        localStorage.setItem("token", keycloak.token)
        localStorage.setItem("refresh-token", keycloak.refreshToken)
    }
}

const onTokenExpired = () => {
    keycloak
        .updateToken(30)
        .then(() => {
            console.log("successfully get a new token", keycloak.token)
        })
        .catch(() => {
            console.error("failed to refresh token")
        })
}

export const lightTheme = {
    components: {
        MuiAppBar: {
            styleOverrides: {
                colorSecondary: {
                    color: "#fff",
                    backgroundColor: "#003366",
                    borderBottom: "3px solid #FCBA19"
                }
            }
        }
    }
}

const CustomAdminWithKeycloak = () => {
    const checkRole = (token: string) => {
        if (token !== "") {
            const decoded: any = jwt_decode(token)
            console.log(decoded)
            if (decoded.client_roles) {
                return true
            }
        }

        return false
    }
    const customAuthProvider = useAuthProvider(process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "")

    return (
        <>
            <div />
            {checkRole(keycloak.token?.toString() || "") ? (
                <>
                    {console.log(checkRole(localStorage.getItem("token")?.toString() || ""))}
                    <Admin
                        theme={lightTheme}
                        dataProvider={dataProvider}
                        authProvider={customAuthProvider}
                        loginPage={false}
                        layout={Layout}
                        disableTelemetry
                        requireAuth
                    >
                        <Resource name="wage" list={WageList} />
                        <Resource name="claims" list={ClaimsList} edit={ClaimsEdit} />
                    </Admin>
                </>
            ) : (
                <LoginPage />
            )}
        </>
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
            <CustomAdminWithKeycloak />
            <Footer />
        </ReactKeycloakProvider>
    )
}

export default App
