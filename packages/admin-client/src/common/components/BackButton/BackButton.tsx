import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/pro-solid-svg-icons"
import { COLOURS } from "../../../Colours"
import { Button, Stack } from "@mui/material"
import { useRedirect } from "react-admin"

interface BackButtonProps {
    resource: string
}

const BackButton: React.FC<BackButtonProps> = ({ resource }) => {
    const redirect = useRedirect()

    const handleClick = (event) => {
        redirect("list", resource)
    }

    return (
        <Button
            type="button"
            onClick={handleClick}
            sx={{
                color: COLOURS.LIGHTBLUE_TEXT,
                padding: "0.65em 2em",
                marginRight: "2em",
                backgroundColor: "transparent",
                fontSize: "1rem",
                border: "none",
                cursor: "pointer",
                borderRadius: "6px",
                ":hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" }
            }}
        >
            <span aria-hidden={true}>
                <Stack direction="row" style={{ alignItems: "center" }}>
                    <FontAwesomeIcon icon={faArrowLeft} size="lg" style={{ marginRight: 12 }} scale="2" />
                    BACK
                </Stack>
            </span>
        </Button>
    )
}

export default BackButton
