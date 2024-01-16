import { Datagrid, DatagridBody, useGetIdentity, useListContext } from "react-admin"
import CustomDatagridRow from "../CustomDatagridRow/CustomDatagridRow"
import { CustomDatagridHeader } from "../CustomDatagridHeader/CustomDatagridHeader"
import { FormBulkActionButtons } from "../FormBulkActionButtons/FormBulkActionButtons"
import { DatagridStyles } from "../../styles/DatagridStyles"
import { useEffect, useState } from "react"

// CustomDatagrid:
// - Each row includes a PDF button.
// - Each row can include a calculator button.
// - Rows are keyboard navigable and keyboard selectable.

// Props: {ariaLabel, showCalculatorButton, ...T}, where T becomes the built-in props.
type CustomDatagridProps<T> = T & {
    ariaLabel: string
    showCalculatorButton?: boolean
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
}

type CustomDatagridBodyProps<T> = T & {
    showCalculatorButton?: boolean
}

const CustomDatagridBody = <T,>({ showCalculatorButton, ...props }: CustomDatagridBodyProps<T>) => {
    return <DatagridBody {...props} row={<CustomDatagridRow showCalculatorButton={showCalculatorButton} />} />
}

const CustomDatagrid = <T,>({ ariaLabel, showCalculatorButton, setIsLoading, ...props }: CustomDatagridProps<T>) => {
    const { identity } = useGetIdentity()
    const [hasBulkActions, setHasBulkActions] = useState<boolean>(false)
    const { isLoading } = useListContext()

    useEffect(() => {
        setHasBulkActions(identity && identity?.idp && identity.idp === "idir")
    }, [identity])

    useEffect(() => {
        if (setIsLoading) {
            setIsLoading(isLoading)
        }
    }, [isLoading])

    const skipToListAside = (event: any) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            const element = document.getElementById("list-aside")
            element?.focus()
        }
    }

    return (
        <Datagrid
            {...props}
            bulkActionButtons={hasBulkActions ? <FormBulkActionButtons /> : false}
            sx={DatagridStyles}
            body={<CustomDatagridBody showCalculatorButton={showCalculatorButton} />}
            header={<CustomDatagridHeader />}
            aria-label={ariaLabel}
            id="datagrid"
            tabIndex={0}
            onKeyDown={skipToListAside}
        />
    )
}

export default CustomDatagrid
