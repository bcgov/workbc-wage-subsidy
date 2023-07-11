import { Box, Checkbox, TableCell, TableRow } from "@mui/material"
import { Datagrid, DatagridBody, RecordContextProvider } from "react-admin"
import PdfButtonField from "../PdfButtonField/PdfButtonField"
import React from "react"

const CustomDatagridRow = ({ record, id, onToggleItem, children, selected, selectable }) => (
    <RecordContextProvider value={record}>
        <TableRow>
            {/* first column: selection checkbox and custom buttons */}
            <TableCell padding="none">
                <Box display="flex" padding="0em 0em 0em 0.53em">
                    {selectable && <Checkbox checked={selected} onClick={(event) => onToggleItem(id, event)} />}
                    <Box width="100%" justifyContent="center" alignSelf="center">
                        <PdfButtonField />
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

const CustomDatagridBody = (props) => (
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
            />
        }
    />
)
export const CustomDatagrid = (props) => <Datagrid {...props} body={<CustomDatagridBody />} />
