import { faArrowsRotate } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "@mui/material"
import { useEffect, useState } from "react"
import { useListContext } from "react-admin"

export const FormBulkActionButtons = () => {
    const { selectedIds } = useListContext()
    const [tabIndex, setTabIndex] = useState(-1)

    // When bulk actions toolbar is hidden, prevent buttons from receiving keyboard focus.
    useEffect(() => {
        setTabIndex(selectedIds.length > 0 ? 0 : -1)
    }, [selectedIds])

    useEffect(() => {
        const unselectButton = document.querySelector('button[title="Unselect"]') as any
        if (unselectButton) {
            unselectButton.tabIndex = tabIndex
        }
    }, [tabIndex])

    return (
        <Button
            tabIndex={tabIndex}
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "inherit"
            }}
            onClick={() => console.log("Move button")}
        >
            <FontAwesomeIcon icon={faArrowsRotate} style={{ marginRight: 10 }} size="xl" />
            MOVE
        </Button>
    )
}
