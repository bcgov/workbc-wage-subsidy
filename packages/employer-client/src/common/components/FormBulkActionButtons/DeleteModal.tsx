import { Box, Button, MenuItem, MenuList } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft } from "@fortawesome/pro-solid-svg-icons"
import { faAngleRight } from "@fortawesome/pro-solid-svg-icons"
import BCGovModal from "../BCGovModal/BCGovModal"
import { COLOURS } from "../../../Colours"
import ModalButton from "../BCGovModal/BCGovModalButton"
import React, { useEffect, useState } from "react"
import { ScreenReaderOnly } from "../../styles/ScreenReaderOnly"
import { useDataProvider, useDelete, useGetIdentity, useRefresh } from "react-admin"
import { useMutation } from "react-query"

interface DeleteModalProps {
    isOpen: boolean
    onRequestClose: (event: any) => void
    contentLabel: string
    selectedIds: any[]
    resource: string
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onRequestClose, contentLabel, selectedIds, resource }) => {
    const { identity } = useGetIdentity()
    const dataProvider = useDataProvider()
    const refresh = useRefresh()
    const [availableUsers, setAvailableUsers] = useState<any[]>([])
    const [selectedUsers, setSelectedUsers] = useState<any[]>([])
    const [availableUsersSelection, setAvailableUsersSelection] = useState<any[]>([])
    const [selectedUsersSelection, setSelectedUsersSelection] = useState<any[]>([])
    const [usersObtained, setUsersObtained] = useState<boolean>(false)

    console.log(selectedIds)
    console.log(dataProvider)
    useEffect(() => {
        if (isOpen) {
            // getAvailableUsers()
        } else {
            // clearUsersLists()
            // setUsersObtained(false)
        }
    }, [isOpen])

    // const handleDelete = async() => {
    //     try {
    //         // await deleteForm(

    //         // )
    //         console.log('handleDelete');
    //     } catch (error) {
    //         console.log('error', error);
    //     }
    // }

    const { mutate: handleDelete } = useMutation((event: any) => {
        return dataProvider
            .delete("", {
                id: selectedIds[0]
            })
            .then(({ data }) => {
                console.log(data)
            })
    })

    // const { mutate: getPdf, isLoading } = useMutation((formType) => {
    //     return dataProvider
    //         .getPdf(resource, {
    //             id: record.id,
    //             formType: formType
    //         })
    //         .then(({ result }) => {
    //             const filename =
    //                 (resource === "applications" ? "application_" : "claim_") + record.form_confirmation_id + ".pdf"
    //             downloadPdf(result, filename)
    //         })
    // })

    return (
        <>
            {
                <BCGovModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={contentLabel}>
                    <h2>Delete</h2>
                    <p>Are you sure you want to delete {selectedIds.length > 1 ? "these forms?" : "this form?"}</p>
                    <Box width="100%" textAlign="right" paddingTop="1em">
                        <ModalButton
                            text="Yes"
                            showIcon={false}
                            onClick={handleDelete}
                            ariaLabel="Delete selected forms"
                        />
                        <ModalButton text="Cancel" showIcon={false} onClick={onRequestClose} ariaLabel="Close dialog" />
                    </Box>
                </BCGovModal>
            }
        </>
    )
}

export default DeleteModal
