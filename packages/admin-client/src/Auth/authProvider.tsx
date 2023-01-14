/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable prefer-promise-reject-errors */
import { useKeycloak } from "@react-keycloak/web"
import jwt_decode from "jwt-decode"

const useAuthProvider = (clientID: string) => {
    const { keycloak } = useKeycloak()
    return {
        login: () => keycloak.login(),
        checkError: () => Promise.resolve(),
        checkAuth: () =>
            localStorage.getItem("token") ? Promise.resolve() : Promise.reject("Failed to obtain access token."),
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
                const username = decoded.bceid_username || decoded.idir_username || ""
                const guid = decoded.bceid_user_guid || decoded.idir_guid || ""
                const fullName = decoded.name
                return Promise.resolve({ id, idp, fullName, username, guid })
            }
            return Promise.reject("Failed to get identity")
        },
        getPermissions: () => {
            if (localStorage.getItem("token")) {
                const decoded: any = jwt_decode(localStorage.getItem("token")?.toString() || "")
                const roles = decoded.client_roles
                if (!roles) {
                    return Promise.resolve(new Error("Member does not have a role, you should not be seeing this"))
                }
                if (roles.includes("admin")) {
                    localStorage.setItem("permissions", "admin")
                    return Promise.resolve("admin")
                }
                if (roles.includes("member")) {
                    localStorage.setItem("permissions", "member")
                    return Promise.resolve("member")
                }
            }
            return Promise.reject(new Error("Failed to get roles"))

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
