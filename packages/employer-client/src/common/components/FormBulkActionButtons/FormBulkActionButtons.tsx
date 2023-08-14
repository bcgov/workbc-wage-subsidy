import { faHandshake } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "@mui/material"
import { useEffect, useState } from "react"
import { useListContext } from "react-admin"

export const FormBulkActionButtons = () => {
    const { selectedIds } = useListContext()
    const [tabIndex, setTabIndex] = useState(-1)
    const [ariaHidden, setAriaHidden] = useState(true)

    // When bulk actions toolbar is hidden:
    // - Prevent buttons from receiving keyboard focus.
    // - Hide contents from screen reader.
    useEffect(() => {
        setTabIndex(selectedIds.length > 0 ? 0 : -1)
        setAriaHidden(selectedIds.length > 0 ? false : true)
    }, [selectedIds])

    useEffect(() => {
        const unselectButton = document.querySelector('button[title="Unselect"]') as any
        if (unselectButton) {
            unselectButton.tabIndex = tabIndex
            unselectButton.ariaHidden = { ariaHidden }
        }

        const itemsSelectedLabel = document.querySelector(".MuiTypography-subtitle1") as any
        if (itemsSelectedLabel) {
            itemsSelectedLabel.ariaHidden = { ariaHidden }
        }
    }, [tabIndex])

    return (
        // 'SHARE' button
        <Button
            tabIndex={tabIndex}
            aria-hidden={ariaHidden}
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "inherit"
            }}
            onClick={() => console.log("Share button")}
            aria-label="Share form with another user"
        >
            <FontAwesomeIcon icon={faHandshake} style={{ marginRight: 10 }} size="xl" />
            SHARE
        </Button>
    )
}
