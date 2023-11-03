import { Button } from "@mui/material"
import { useKeycloak } from "@react-keycloak/web"

const LoginPage = () => {
    const { keycloak } = useKeycloak()
    return (
        <Button
            onClick={() => {
                keycloak.logout()
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
