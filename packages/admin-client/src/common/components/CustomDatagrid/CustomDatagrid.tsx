import { Box, Checkbox, TableCell, TableRow } from "@mui/material"
import { Datagrid, DatagridBody, RecordContextProvider } from "react-admin"
import PdfButtonField from "../PdfButtonField/PdfButtonField"
import React from "react"
import CalculatorButtonField from "../CalculatorButtonField/CalculatorButtonField"

const CustomDatagridRow = ({ record, id, onToggleItem, children, selected, selectable, calculatorButton }) => (
    <RecordContextProvider value={record}>
        <TableRow>
            {/* first column: selection checkbox and custom buttons */}
            <TableCell padding="none">
                <Box display="flex" padding="0em 0em 0em 0.53em">
                    {selectable && <Checkbox checked={selected} onClick={(event) => onToggleItem(id, event)} />}
                    <Box width="100%" justifyContent="center" alignSelf="center">
                        <Box display="flex">
                            <PdfButtonField />
                            {calculatorButton === true && <CalculatorButtonField />}
                        </Box>
                    </Box>
                </Box>
            </TableCell>
            {/* data columns based on children */}
            {React.Children.map(children, (field) => (
                <TableCell key={`${id}-${field.props.source}`}>{field}</TableCell>
            ))}
        </TableRow>
    </RecordContextProvider>
)

type CustomDatagridProps<T> = T & {
    calculatorButton?: boolean
}

const CustomDatagridBody = <T,>({ calculatorButton, ...props }: CustomDatagridProps<T>) => (
    <DatagridBody
        {...props}
        row={
            <CustomDatagridRow
                record={undefined}
                id={undefined}
                onToggleItem={undefined}
                children={undefined}
                selected={undefined}
                selectable={undefined}
                calculatorButton={calculatorButton}
            />
        }
    />
)

const CustomDatagrid = <T,>({ calculatorButton, ...props }: CustomDatagridProps<T>) => (
    <Datagrid {...props} body={<CustomDatagridBody calculatorButton={calculatorButton} />} />
)

export default CustomDatagrid
