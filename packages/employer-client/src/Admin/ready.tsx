import React from "react"
import { useLogout } from "react-admin"
// eslint-disable-next-line import/no-unresolved
import { useKeycloak } from "@react-keycloak/web"
import BCEID_LOGO from "../assets/logo-banner.png"
import "./ready.css"

const Ready = () => {
    const { keycloak } = useKeycloak()
    const [access, setAccess] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const logout = useLogout()
    const handleClick = () => logout()
    React.useEffect(() => {
        // checking storage for events when storage is changed
        if (keycloak && keycloak.idTokenParsed?.identity_provider === "bceidboth") {
            setAccess(true)
            setLoading(false)
        } else if (keycloak.authenticated) {
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div>
            <header>
                <div className="banner">
                    <a href="https://gov.bc.ca">
                        <img
                            src={BCEID_LOGO}
                            alt="Go to the Government of British Columbia website"
                            width="100"
                            height="auto"
                        />
                    </a>
                    <h1>Wage Subsidy</h1>
                </div>
                <div className="other">
                    <button className="BC-Gov-PrimaryButton-Dark" type="button" name="button" onClick={handleClick}>
                        Logout
                    </button>
                </div>
            </header>

            <div className="content">
                <div className="card">
                    {loading && <h2>Loading...</h2>}
                    {!access && !loading ? <h2>Not authorized to view the application!</h2> : null}
                </div>
            </div>
        </div>
    )
}

export default Ready
