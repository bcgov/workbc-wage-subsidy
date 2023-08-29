import { useCallback, useEffect, useState } from "react"
import { useListContext } from "react-admin"
import MoveButton from "./MoveButton"
import MoveModal from "./MoveModal"

export const FormBulkActionButtons = () => {
    const { selectedIds } = useListContext()
    const [tabIndex, setTabIndex] = useState(-1)
    const [ariaHidden, setAriaHidden] = useState(true)
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const openModal = useCallback(() => {
        setModalIsOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        setModalIsOpen(false)
    }, [])

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
        <>
            <MoveButton tabIndex={tabIndex} ariaHidden={ariaHidden} onClick={openModal} />
            <MoveModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Move selection to another catchment"
                selectedIds={selectedIds}
            />
        </>
    )
}
