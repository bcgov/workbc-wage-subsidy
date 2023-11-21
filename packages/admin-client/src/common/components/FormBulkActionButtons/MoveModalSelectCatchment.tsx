import { Box, MenuItem, MenuList, Stack } from "@mui/material"
import BCGovModal from "../BCGovModal/BCGovModal"
import { COLOURS } from "../../../Colours"
import ModalButton from "../BCGovModal/BCGovModalButton"
import React, { useContext } from "react"
import { CatchmentContext } from "../../contexts/CatchmentContext/CatchmentContext"
import { ScreenReaderOnly } from "../../styles/ScreenReaderOnly"

interface MoveModalProps {
    isOpen: boolean
    onRequestClose: (event: any) => void
    contentLabel: string
    targetCatchment: number
    setTargetCatchment: React.Dispatch<React.SetStateAction<number>>
    openModalSelectWorkBcCentre: () => void
}

const MoveModalSelectCatchment: React.FC<MoveModalProps> = ({
    isOpen,
    onRequestClose,
    contentLabel,
    targetCatchment,
    setTargetCatchment,
    openModalSelectWorkBcCentre
}) => {
    const cc = useContext(CatchmentContext)

    const handleContinue = (event: any) => {
        if (targetCatchment !== -1) {
            onRequestClose(event)
            openModalSelectWorkBcCentre()
        }
    }

    const handleCancel = (event: any) => {
        onRequestClose(event)
    }

    return (
        <BCGovModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={contentLabel}>
            <h2>Move to another Catchment</h2>
            <p>Select the Catchment that you want to move the form to</p>
            <span style={ScreenReaderOnly}>You must select a catchment to proceed.</span>
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
            <Box display="flex" width="100%" justifyContent="right" paddingTop="1em">
                <Stack direction="row" gap={2}>
                    <ModalButton
                        text="CONTINUE"
                        showIcon={false}
                        onClick={handleContinue}
                        ariaLabel="Continue to WorkBC Centre selection dialog"
                        // Require valid catchment selection to proceed.
                        disabled={targetCatchment < 1 || targetCatchment > 45}
                    />
                    <ModalButton text="CANCEL" showIcon={false} onClick={handleCancel} ariaLabel="Close dialog" />
                </Stack>
            </Box>
        </BCGovModal>
    )
}

export default MoveModalSelectCatchment
