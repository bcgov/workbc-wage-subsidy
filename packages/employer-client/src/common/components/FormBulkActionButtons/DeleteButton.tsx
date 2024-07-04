import { MouseEvent } from "react"
import { Button } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/pro-solid-svg-icons"

interface DeleteButtonProps {
    tabIndex: number
    ariaHidden: boolean
    onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ tabIndex, ariaHidden, onClick }) => (
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
        aria-label="Delete form"
    >
        <FontAwesomeIcon icon={faTrash} style={{ marginRight: 10 }} size="xl" />
        DELETE
    </Button>
)

export default DeleteButton
