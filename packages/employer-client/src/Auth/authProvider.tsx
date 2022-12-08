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
                console.log(decoded)
                const id = decoded.sub
                const idp = decoded.identity_provider
                const username = decoded.bceid_username || decoded.idir_username || ""
                const guid = decoded.bceid_user_guid || decoded.idir_guid || ""
                const fullName = decoded.name
                return Promise.resolve({ id, idp, fullName, username, guid })
            }
            return Promise.reject("Failed to get identity")
        },
        getPermissions: async () => {
            if (localStorage.getItem("token")) {
                return true
            }

            /*
            if (keycloak.token) {
                const decoded : any = jwt_decode(keycloak.token);
                decoded.resource_access[clientID].roles.forEach((el: string) => {
                    if (el === "admin") {
                        hasRole = true;
                        return
                    }
                });
            }
            if (hasRole) {
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
            */
        }
    }
}

export default useAuthProvider
