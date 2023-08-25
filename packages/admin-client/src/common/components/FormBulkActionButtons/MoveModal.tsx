import { Box, MenuItem, MenuList } from "@mui/material"
import BCGovModal from "../BCGovModal/BCGovModal"
import { COLOURS } from "../../../Colours"
import ModalButton from "../BCGovModal/BCGovModalButton"
import React, { useContext, useEffect, useState } from "react"
import { CatchmentContext } from "../../contexts/CatchmentContext/CatchmentContext"
import { useListContext, useRefresh, useUpdateMany } from "react-admin"
import { ScreenReaderOnly } from "../../styles/ScreenReaderOnly"

interface MoveModalProps {
    isOpen: boolean
    onRequestClose: (event: any) => void
    contentLabel: string
    selectedIds: any[]
}

const MoveModal: React.FC<MoveModalProps> = ({ isOpen, onRequestClose, contentLabel, selectedIds }) => {
    const refresh = useRefresh()
    const cc = useContext(CatchmentContext)
    const { resource, onUnselectItems } = useListContext()
    const [targetCatchment, setTargetCatchment] = useState(-1)
    const [updateCatchment, { isLoading }] = useUpdateMany(resource, {
        ids: selectedIds,
        data: { catchmentNo: targetCatchment }
    })

    const moveToSelectedCatchment = (event: any) => {
        if (targetCatchment !== -1) {
            updateCatchment()
        }
        onRequestClose(event)
    }

    // After catchment update finishes, refresh UI data.
    useEffect(() => {
        if (!isLoading) {
            setTargetCatchment(-1)
            onUnselectItems()
            refresh()
        }
    }, [isLoading])

    return (
        <BCGovModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={contentLabel}>
            <h2>Move to another Catchment</h2>
            <p>Select the Catchment that you want to move the form to</p>
            <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
                <Box sx={{ display: "flex", flexDirection: "column", width: "80%", lineHeight: "0.1em" }}>
                    <p>Available</p>
                    <MenuList
                        style={{ maxHeight: "20em", overflow: "auto", border: "2px solid " + COLOURS.MEDIUMGREY }}
                    >
                        {cc.catchments.map(
                            (catchment) =>
                                catchment.id !== cc.catchment.id && (
                                    <MenuItem
                                        key={catchment.id}
                                        value={catchment.id}
                                        selected={targetCatchment === catchment.id}
                                        onClick={() => setTargetCatchment(catchment.id)}
                                    >
                                        {/* Manually indicate selection, since aria-selected having no effect for unknown reasons. */}
                                        <span style={ScreenReaderOnly}>
                                            {"Catchment " +
                                                catchment.name +
                                                (targetCatchment === catchment.id ? ", selected" : ", unselected")}
                                        </span>
                                        <span aria-hidden={true}>{catchment.name}</span>
                                    </MenuItem>
                                )
                        )}
                    </MenuList>
                </Box>
            </Box>
            <Box width="100%" textAlign="right" paddingTop="1em">
                <ModalButton
                    text="OK"
                    showIcon={false}
                    onClick={moveToSelectedCatchment}
                    ariaLabel="Move selected forms to selected catchment and close dialog"
                />
                <ModalButton text="CANCEL" showIcon={false} onClick={onRequestClose} ariaLabel="Close dialog" />
            </Box>
        </BCGovModal>
    )
}

export default MoveModal
