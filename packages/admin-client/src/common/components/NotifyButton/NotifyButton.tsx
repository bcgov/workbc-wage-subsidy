import { useEffect, useState, useContext } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { LoadingIndicator, useListContext, useDataProvider } from "react-admin"
import { CatchmentContext } from "../../contexts/CatchmentContext/CatchmentContext"
import { faFlag } from "@fortawesome/pro-solid-svg-icons"
import { COLOURS } from "../../../Colours"
import { Button } from "@mui/material"

const NotifyButton: React.FC = () => {
    const cc = useContext(CatchmentContext)
    const dataProvider = useDataProvider()
    const listContext = useListContext()
    const [notifications, setNotifications] = useState(false)
    const [loading, setLoading] = useState(true)
    const [ariaLabel, setAriaLabel] = useState("Turn off notifications")

    const handleClick = () => {
        setLoading(true)
        if (notifications === true) {
            dataProvider
                .deleteNotifications(listContext.resource.split("s")[0], { catchment: cc.catchment.id })
                .then((response: any) => {
                    console.log(response)
                    setLoading(false)
                    setNotifications(false)
                })
                .catch((error: any) => {
                    setLoading(false)
                    console.log(error)
                    alert("There was an error turning off notifications.")
                })
        } else {
            dataProvider
                .addNotifications(listContext.resource.split("s")[0], { catchment: cc.catchment.id })
                .then((response: any) => {
                    console.log(response)
                    setLoading(false)
                    setNotifications(true)
                })
                .catch((error: any) => {
                    setLoading(false)
                    console.log(error)
                    alert("There was an error turning on notifications.")
                })
        }
    }

    useEffect(() => {
        setAriaLabel("Turn " + (notifications ? "off" : "on") + " notifications")
    }, [notifications])

    // On first load or catchment change, check if the user has notifications enabled for this catchment.
    useEffect(() => {
        setLoading(true)
        dataProvider
            .getNotifications(listContext.resource.split("s")[0], { catchment: cc.catchment.id })
            .then((response: any) => {
                setLoading(false)
                if (response.length > 0) {
                    setNotifications(true)
                } else {
                    setNotifications(false)
                }
            })
    }, [cc.catchment.id])

    if (loading) {
        return <LoadingIndicator sx={{ color: COLOURS.MEDIUMGREY, maxWidth: "300px", marginRight: "4em" }} />
    }

    return (
        <Button
            type="button"
            onClick={handleClick}
            sx={{
                color: notifications ? COLOURS.LIGHTBLUE_TEXT : COLOURS.MEDIUMGREY,
                padding: "0.65em 1em",
                marginRight: "2em",
                backgroundColor: "transparent",
                fontSize: "1rem",
                border: "none",
                cursor: "pointer",
                borderRadius: "6px",
                ":hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" }
            }}
            aria-label={ariaLabel}
        >
            <span aria-hidden={true}>
                {" "}
                <FontAwesomeIcon icon={faFlag} size="lg" style={{ marginRight: 12 }} scale="2" />
                NOTIFY
            </span>
        </Button>
    )
}

export default NotifyButton
