import { Datagrid, DatagridBody } from "react-admin"
import CustomDatagridRow from "../CustomDatagridRow/CustomDatagridRow"
import { CustomDatagridHeader } from "../CustomDatagridHeader/CustomDatagridHeader"

// CustomDatagrid:
// - Each row includes a PDF button.
// - Each row can include a calculator button.
// - Rows are keyboard navigable and keyboard selectable.

// Props: {ariaLabel, showCalculatorButton, ...T}, where T becomes the built-in props.
type CustomDatagridProps<T> = T & {
    ariaLabel: string
    showCalculatorButton?: boolean
}

type CustomDatagridBodyProps<T> = T & {
    showCalculatorButton?: boolean
}

const CustomDatagridBody = <T,>({ showCalculatorButton, ...props }: CustomDatagridBodyProps<T>) => {
    return <DatagridBody {...props} row={<CustomDatagridRow showCalculatorButton={showCalculatorButton} />} />
}

const CustomDatagrid = <T,>({ ariaLabel, showCalculatorButton, ...props }: CustomDatagridProps<T>) => {
    const skipToListAside = (event: any) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            const element = document.getElementById("list-aside")
            element?.focus()
        }
    }

    return (
        <Datagrid
            {...props}
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
