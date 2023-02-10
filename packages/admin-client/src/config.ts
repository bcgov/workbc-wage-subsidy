declare global {
    interface Window {
        _env_: {
            REACT_APP_ADMIN_API_URL: string

            // Keycloak
            REACT_APP_KEYCLOAK_URL: string
            REACT_APP_KEYCLOAK_CLIENT_ID: string
            REACT_APP_KEYCLOAK_REALM: string
        }
    }
}

const ADMIN_API_URL = window._env_.REACT_APP_ADMIN_API_URL || process.env.REACT_APP_ADMIN_API_URL

// keycloak
const KEYCLOAK_URL = window._env_.REACT_APP_KEYCLOAK_URL || process.env.REACT_APP_KEYCLOAK_URL
const KEYCLOAK_CLIENT_ID = window._env_.REACT_APP_KEYCLOAK_CLIENT_ID || process.env.REACT_APP_KEYCLOAK_CLIENT_ID
const KEYCLOAK_REALM = window._env_.REACT_APP_KEYCLOAK_REALM || process.env.REACT_APP_KEYCLOAK_REALM

export const AppConfig = {
    apiUrl: ADMIN_API_URL,
    keycloak: {
        url: KEYCLOAK_URL,
        realm: KEYCLOAK_REALM,
        clientId: KEYCLOAK_CLIENT_ID
    }
}
