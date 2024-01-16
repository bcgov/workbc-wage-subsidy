import { useCallback, useEffect, useState } from "react"
import { useListContext } from "react-admin"
import MoveButton from "./MoveButton"
import MoveModalSelectCatchment from "./MoveModalSelectCatchment"
import MoveModalSelectWorkBcCentre from "./MoveModalSelectWorkBcCentre"
import { WorkBcCentres } from "../../data/WorkBcCentres"

export const FormBulkActionButtons = () => {
    const { selectedIds } = useListContext()
    const [tabIndex, setTabIndex] = useState(-1)
    const [ariaHidden, setAriaHidden] = useState(true)
    const [modalSelectCatchmentIsOpen, setModalSelectCatchmentIsOpen] = useState(false)
    const [modalSelectWorkBcCentreIsOpen, setModalSelectWorkBcCentreIsOpen] = useState(false)
    const [targetCatchment, setTargetCatchment] = useState(-1)
    const [targetCentre, setTargetCentre] = useState("")
    const workBcCentres = Object.keys(WorkBcCentres).map((code: string) => ({
        code: code,
        name: WorkBcCentres[code],
        catchment: Number(code.split("-")[0])
    }))
    const availableCentres = workBcCentres.filter((centre) => centre.catchment === targetCatchment)

    const openModalSelectCatchment = useCallback(() => {
        setModalSelectCatchmentIsOpen(true)
    }, [])
    const closeModalSelectCatchment = useCallback(() => {
        setModalSelectCatchmentIsOpen(false)
    }, [])
    const openModalSelectWorkBcCentre = useCallback(() => {
        setModalSelectWorkBcCentreIsOpen(true)
    }, [])
    const closeModalSelectWorkBcCentre = useCallback(() => {
        setModalSelectWorkBcCentreIsOpen(false)
    }, [])

    const handleMove = (event: any) => {
        // Clear any previous selections before opening.
        setTargetCatchment(-1)
        setTargetCentre("")
        openModalSelectCatchment()
    }

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
            <MoveButton tabIndex={tabIndex} ariaHidden={ariaHidden} onClick={handleMove} />
            <MoveModalSelectCatchment
                isOpen={modalSelectCatchmentIsOpen}
                onRequestClose={closeModalSelectCatchment}
                contentLabel="Move selection to another catchment. Select target catchment."
                targetCatchment={targetCatchment}
                setTargetCatchment={setTargetCatchment}
                openModalSelectWorkBcCentre={openModalSelectWorkBcCentre}
            />
            <MoveModalSelectWorkBcCentre
                isOpen={modalSelectWorkBcCentreIsOpen}
                onRequestClose={closeModalSelectWorkBcCentre}
                contentLabel="Select target WorkBC Centre."
                selectedIds={selectedIds}
                targetCatchment={targetCatchment}
                targetCentre={targetCentre}
                setTargetCentre={setTargetCentre}
                availableCentres={availableCentres}
                openModalSelectCatchment={openModalSelectCatchment}
            />
        </>
    )
}
