import { Box, MenuItem, MenuList, Stack } from "@mui/material"
import BCGovModal from "../BCGovModal/BCGovModal"
import { COLOURS } from "../../../Colours"
import ModalButton from "../BCGovModal/BCGovModalButton"
import React, { useEffect } from "react"
import { useListContext, useRefresh, useUpdateMany } from "react-admin"
import { ScreenReaderOnly } from "../../styles/ScreenReaderOnly"

interface MoveModalSelectWorkBcCentreProps {
    isOpen: boolean
    onRequestClose: (event: any) => void
    contentLabel: string
    selectedIds: any[]
    targetCatchment: number
    targetCentre: string
    setTargetCentre: React.Dispatch<React.SetStateAction<string>>
    availableCentres: { code: string; name: string; catchment: number }[]
    openModalSelectCatchment: () => void
}

const MoveModalSelectWorkBcCentre: React.FC<MoveModalSelectWorkBcCentreProps> = ({
    isOpen,
    onRequestClose,
    contentLabel,
    selectedIds,
    targetCatchment,
    targetCentre,
    setTargetCentre,
    availableCentres,
    openModalSelectCatchment
}) => {
    const refresh = useRefresh()
    const { resource, onUnselectItems } = useListContext()
    const [updateCatchment, { isLoading }] = useUpdateMany(resource, {
        ids: selectedIds,
        data: { catchmentNo: targetCatchment, workBcCentre: targetCentre }
    })

    const handleBack = (event: any) => {
        onRequestClose(event)
        // Clear selection before returning to previous dialog.
        setTargetCentre("")
        openModalSelectCatchment()
    }

    const handleOK = (event: any) => {
        if (targetCatchment !== -1 && targetCentre !== "") {
            updateCatchment()
        }
        onRequestClose(event)
    }

    const handleCancel = (event: any) => {
        onRequestClose(event)
    }

    // After catchment update finishes, refresh UI data.
    useEffect(() => {
        if (!isLoading) {
            onUnselectItems()
            refresh()
        }
    }, [isLoading])

    return (
        <BCGovModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={contentLabel}>
            <h2>Move to another Catchment</h2>
            {availableCentres.length > 0 ? (
                <>
                    <p>Select the WorkBC Centre that you want to move the form to</p>
                    <span style={ScreenReaderOnly}>You must select a WorkBC Centre to proceed.</span>
                    <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", width: "90%", lineHeight: "0.1em" }}>
                            <p>Available for catchment {targetCatchment}</p>
                            <MenuList
                                style={{
                                    maxHeight: "20em",
                                    overflow: "auto",
                                    border: "2px solid " + COLOURS.MEDIUMGREY
                                }}
                            >
                                {availableCentres.map((centre) => (
                                    <MenuItem
                                        key={centre.code}
                                        value={centre.code}
                                        selected={targetCentre === centre.code}
                                        onClick={() => setTargetCentre(centre.code)}
                                    >
                                        {/* Manually indicate selection, since aria-selected having no effect for unknown reasons. */}
                                        <span style={ScreenReaderOnly}>
                                            {centre.name +
                                                (targetCentre === centre.code ? ", selected" : ", unselected")}
                                        </span>
                                        <span aria-hidden={true}>{centre.name}</span>
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Box>
                    </Box>
                </>
            ) : (
                <p>
                    There are no WorkBC Centres available for catchment {targetCatchment}. Please select another
                    catchment.
                </p>
            )}
            <Box display="flex" width="100%" paddingTop="1em">
                <ModalButton
                    text="BACK"
                    showIcon={false}
                    onClick={handleBack}
                    ariaLabel="Return to catchment selection dialog"
                />
                <Box display="flex" width="100%" justifyContent="right">
                    <Stack direction="row">
                        <ModalButton
                            text="OK"
                            showIcon={false}
                            onClick={handleOK}
                            ariaLabel={
                                "Move selected forms to catchment" +
                                targetCatchment +
                                ", " +
                                availableCentres.find((centre) => centre.code === targetCentre)?.name +
                                ", then close dialog"
                            }
                            // Require valid catchment selection and workbc centre selection to proceed.
                            disabled={
                                targetCatchment < 1 ||
                                targetCatchment > 45 ||
                                availableCentres.filter((centre) => centre.code === targetCentre).length !== 1
                            }
                        />
                        <ModalButton text="CANCEL" showIcon={false} onClick={handleCancel} ariaLabel="Close dialog" />
                    </Stack>
                </Box>
            </Box>
        </BCGovModal>
    )
}

export default MoveModalSelectWorkBcCentre
