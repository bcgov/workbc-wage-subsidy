import { useKeycloak } from "@react-keycloak/web"
import jwt_decode from "jwt-decode"

const useAuthProvider = (clientID: string) => {
    const { keycloak } = useKeycloak()
    return {
        login: () => keycloak.login(),
        checkError: () => Promise.resolve(),
        checkAuth: () => {
            return localStorage.getItem("token") ? Promise.resolve() : Promise.reject("Failed to obtain access token.")
        },
        logout: () => {
            localStorage.removeItem("token")
            localStorage.removeItem("refresh_token")
            localStorage.removeItem("permissions")
            return keycloak.logout()
        },
        getIdentity: () => {
            if (keycloak.token) {
                const decoded: any = jwt_decode(keycloak.token)
                const id = decoded.sub
                const idp = decoded.identity_provider
                const idpUsername = decoded.idp_username
                const guid = decoded.bceid_user_guid || decoded.idir_guid || ""
                const fullName = decoded.name
                const email = decoded.email
                const businessGuid = decoded?.bceid_business_guid || null
                const businessName = decoded?.bceid_business_name || null
                return Promise.resolve({ id, idp, idpUsername, fullName, guid, email, businessGuid, businessName })
            }
            return Promise.reject("Failed to get identity")
        },
        getPermissions: async () => {
            if (localStorage.getItem("token")) {
                return true
            }
        }
    }
}

export default useAuthProvider
