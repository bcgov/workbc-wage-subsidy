import { Button } from "@mui/material"
import { useKeycloak } from "@react-keycloak/web"
import { setEnvVariables } from "../utils/index"

const LoginPage = () => {
    const { keycloak } = useKeycloak()
    const { absolutePath } = setEnvVariables()
    return (
        <Button
            onClick={() => {
                keycloak.logout({ redirectUri: `${absolutePath}logout-success` })
                localStorage.removeItem("token")
                localStorage.removeItem("refresh_token")
                localStorage.removeItem("permissions")
                localStorage.removeItem("access")
            }}
        >
            Logout
        </Button>
    )
}

export default LoginPage
