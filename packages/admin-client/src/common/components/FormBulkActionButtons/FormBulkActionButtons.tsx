import { faArrowsRotate } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const FormBulkActionButtons = () => (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", cursor: "pointer" }}>
        <FontAwesomeIcon icon={faArrowsRotate} style={{ marginRight: 10 }} size="xl" />
        MOVE
    </div>
)
