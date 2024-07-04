import { useCallback, useEffect, useState } from "react"
import { useListContext } from "react-admin"
import ShareButton from "./ShareButton"
import ShareModal from "./ShareModal"
import DeleteButton from "./DeleteButton"
import DeleteModal from "./DeleteModal"

export const FormBulkActionButtons = () => {
    const { resource, selectedIds, onUnselectItems } = useListContext()
    const [tabIndex, setTabIndex] = useState(-1)
    const [ariaHidden, setAriaHidden] = useState(true)
    const [shareModalIsOpen, setShareModalIsOpen] = useState(false)
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)

    const openModal = useCallback((type) => {
        type === "share" ? setShareModalIsOpen(true) : setDeleteModalIsOpen(true)
        // console.log(type);
        // setShareModalIsOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        onUnselectItems()
        setShareModalIsOpen(false)
        setDeleteModalIsOpen(false)
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
            <DeleteButton tabIndex={tabIndex} ariaHidden={ariaHidden} onClick={() => openModal("delete")} />
            <DeleteModal
                isOpen={deleteModalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Delete selection of forms"
                selectedIds={selectedIds}
                resource={resource}
            />
            <ShareButton tabIndex={tabIndex} ariaHidden={ariaHidden} onClick={() => openModal("share")} />
            <ShareModal
                isOpen={shareModalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Share selection with other users"
                selectedIds={selectedIds}
                resource={resource}
            />
        </>
    )
}
