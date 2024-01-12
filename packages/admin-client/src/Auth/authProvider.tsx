/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable prefer-promise-reject-errors */
import { useKeycloak } from "@react-keycloak/web"
import jwt_decode from "jwt-decode"
import axios from "axios"
import { parseCatchments } from "../utils/parseCatchments"

const useAuthProvider = () => {
    const { keycloak } = useKeycloak()
    return {
        login: () => keycloak.login(),
        checkError: () => Promise.resolve(),
        checkAuth: () => (keycloak.token ? Promise.resolve() : Promise.reject("Failed to obtain access token.")),
        logout: () => {
            localStorage.removeItem("token")
            localStorage.removeItem("refresh_token")
            localStorage.removeItem("permissions")
            localStorage.removeItem("access")
            localStorage.clear()
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
        getPermissions: async () => {
            const apiUrl = process.env.REACT_APP_ADMIN_API_URL || "http://localhost:8002"
            let ret
            await axios
                .get(`${apiUrl}/permission`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                .then((res) => {
                    ret = parseCatchments(res.data.permissions)
                })
                .catch((err) => {
                    console.log("error getting permissions")
                })
            return ret
        }
    }
}

export default useAuthProvider
