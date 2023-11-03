import { useEffect, useState } from "react"
import { useLogout } from "react-admin"
import BCEID_LOGO from "../assets/logo-banner.png"
import "./ready.css"
import NotificationCheck from "../common/components/NotificationCheck/NotificationCheck"

const Ready = () => {
    const [access, setAccess] = useState(false)
    const [loading, setLoading] = useState(true)
    const logout = useLogout()
    const handleClick = () => logout()
    useEffect(() => {
        // checking storage for events when storage is changed
        window.addEventListener("storage", () => {
            const storageAccess = localStorage.getItem("access") === "true"
            setAccess(storageAccess)
            setLoading(false)
        })
    }, [])
    return (
        <div>
            <NotificationCheck />
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
                    {!access && !loading ? <h2>Not Authorized</h2> : null}
                </div>
            </div>
        </div>
    )
}

export default Ready
