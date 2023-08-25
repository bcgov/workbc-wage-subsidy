import { MouseEvent } from "react"
import { Button } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSwapArrows } from "@fortawesome/pro-solid-svg-icons"

interface MoveButtonProps {
    tabIndex: number
    ariaHidden: boolean
    onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

const MoveButton: React.FC<MoveButtonProps> = ({ tabIndex, ariaHidden, onClick }) => (
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
        aria-label="Move selection to another catchment"
    >
        <FontAwesomeIcon icon={faSwapArrows} style={{ marginRight: 10 }} size="xl" />
        MOVE
    </Button>
)

export default MoveButton
