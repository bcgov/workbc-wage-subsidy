/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable prefer-promise-reject-errors */
import { useKeycloak } from "@react-keycloak/web"
import jwt_decode from "jwt-decode"
import axios from "axios"

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
        getPermissions: async () => {
            const apiUrl = "http://localhost:8002"
            const res = await axios.get(`${apiUrl}/permission`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            localStorage.setItem("permissions", res.data)
            console.log(res)
            return res.data

            // const request = new Request(`${apiUrl}/permission`, {
            //     method: "GET",
            //     headers: new Headers({
            //         Accept: "application/json",
            //         Authorization: `Bearer ${localStorage.getItem("token")}`
            //     })
            // })
            // return fetch(request)
            //     .then((response: any) => {
            //         if (response.status < 200 || response.status >= 300) {
            //             throw new Error(response.statusText)
            //         }
            //         console.log(response)
            //         return response.data.permissions
            //     })
            //     .then((res) => {
            //         localStorage.setItem("permissions", res)
            //     })

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
