import { Datagrid, DatagridBody } from "react-admin"
import CustomDatagridRow from "./CustomDatagridRow"
import { CustomDatagridHeader } from "./CustomDatagridHeader"

// CustomDatagrid:
// - Each row includes a PDF button.
// - Each row can include a calculator button.
// - Rows are keyboard navigable and keyboard selectable.

// Props: {ariaLabel, showCalculatorButton, ...T}, where T becomes the built-in props.
type CustomDatagridProps<T> = T & {
    ariaLabel: string
    showCalculatorButton?: boolean
    rowAriaLabel?: string
}

type CustomDatagridBodyProps<T> = T & {
    showCalculatorButton?: boolean
    rowAriaLabel?: string
}

const CustomDatagridBody = <T,>({ rowAriaLabel, showCalculatorButton, ...props }: CustomDatagridBodyProps<T>) => {
    return (
        <DatagridBody
            {...props}
            row={<CustomDatagridRow rowAriaLabel={rowAriaLabel} showCalculatorButton={showCalculatorButton} />}
        />
    )
}

const CustomDatagrid = <T,>({ ariaLabel, showCalculatorButton, rowAriaLabel, ...props }: CustomDatagridProps<T>) => {
    const skipToListAside = (event: any) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            const element = document.getElementById("list-aside")
            element?.focus()
        }
    }
    return (
        <Datagrid
            {...props}
            body={<CustomDatagridBody rowAriaLabel={rowAriaLabel} showCalculatorButton={showCalculatorButton} />}
            header={<CustomDatagridHeader />}
            aria-label={ariaLabel}
            id="datagrid"
            tabIndex={0}
            onKeyDown={skipToListAside}
        />
    )
}

export default CustomDatagrid
