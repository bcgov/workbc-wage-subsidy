import { MouseEvent } from "react"
import { Button } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandshake } from "@fortawesome/pro-solid-svg-icons"

interface ShareButtonProps {
    tabIndex: number
    ariaHidden: boolean
    onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

const ShareButton: React.FC<ShareButtonProps> = ({ tabIndex, ariaHidden, onClick }) => (
    <Button
        onClick={onClick}
        tabIndex={tabIndex}
        aria-hidden={ariaHidden}
        style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            cursor: "pointer",
            fontSize: "inherit"
        }}
        aria-label="Share form with another user"
    >
        <FontAwesomeIcon icon={faHandshake} style={{ marginRight: 10 }} size="xl" />
        SHARE
    </Button>
)

export default ShareButton
