import { faHandshake } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const FormBulkActionButtons = () => (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", cursor: "pointer" }}>
        <FontAwesomeIcon icon={faHandshake} style={{ marginRight: 10 }} />
        SHARE
    </div>
)
