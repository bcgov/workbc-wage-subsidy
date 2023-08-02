import { Datagrid, DatagridBody } from "react-admin"
import CustomDatagridRow from "../CustomDatagridRow/CustomDatagridRow"
import { CustomDatagridHeader } from "../CustomDatagridHeader/CustomDatagridHeader"

// CustomDatagrid:
// - Each row includes a PDF button.
// - Each row can include a calculator button.
// - Rows are keyboard navigable and keyboard selectable.

// Props: {showCalculatorButton, ...T}, where T becomes the built-in props.
type CustomDatagridProps<T> = T & {
    showCalculatorButton?: boolean
}

const CustomDatagridBody = <T,>({ showCalculatorButton, ...props }: CustomDatagridProps<T>) => (
    <DatagridBody {...props} row={<CustomDatagridRow showCalculatorButton={showCalculatorButton} />} />
)

const CustomDatagrid = <T,>({ showCalculatorButton, ...props }: CustomDatagridProps<T>) => (
    <Datagrid
        {...props}
        body={<CustomDatagridBody showCalculatorButton={showCalculatorButton} />}
        header={<CustomDatagridHeader />}
    />
)

export default CustomDatagrid
