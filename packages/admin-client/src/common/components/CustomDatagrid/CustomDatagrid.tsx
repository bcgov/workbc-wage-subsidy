import { Datagrid, DatagridBody } from "react-admin"
import CustomDatagridRow from "../CustomDatagridRow/CustomDatagridRow"

// CustomDatagrid:
// - Each row includes a PDF button.
// - Each row can include a calculator button.
// - Rows are keyboard navigable and keyboard selectable.

// Props: {calculatorButton, ...T}, where T becomes the built-in props.
type CustomDatagridProps<T> = T & {
    calculatorButton?: boolean
}

const CustomDatagridBody = <T,>({ calculatorButton, ...props }: CustomDatagridProps<T>) => (
    <DatagridBody {...props} row={<CustomDatagridRow calculatorButton={calculatorButton} />} />
)

const CustomDatagrid = <T,>({ calculatorButton, ...props }: CustomDatagridProps<T>) => (
    <Datagrid {...props} body={<CustomDatagridBody calculatorButton={calculatorButton} />} />
)

export default CustomDatagrid
