import * as React from "react"
import {
    Datagrid,
    DatagridBody,
    List,
    TextField,
    RecordContextProvider,
    DatagridRowProps,
    DatagridBodyProps,
    DatagridProps,
    FieldProps,
    DatagridClasses,
    useDatagridContext,
    Identifier,
    useResourceContext,
    useCreatePath,
    useExpanded,
    DatagridCell
} from "react-admin"
import { TableCell, TableRow, Checkbox, Box, Button } from "@mui/material"
import clsx from "clsx"
import CalculatorButtonField from "../CalculatorButtonField/CalculatorButtonField"
import PdfButtonField from "../PdfButtonField/PdfButtonField"
import { isValidElement, useCallback } from "react"
import { useNavigate } from "react-router-dom"

const computeNbColumns = (expand, children, hasBulkActions) =>
    expand
        ? 1 + // show expand button
          (hasBulkActions ? 1 : 0) + // checkbox column
          React.Children.toArray(children).filter((child) => !!child).length // non-null children
        : 0 // we don't need to compute columns if there is no expand panel;

type CustomDatagridRowProps = DatagridRowProps & {
    showCalculatorButton?: boolean
}

const DatagridRow = ({
    record,
    id,
    hasBulkActions,
    showCalculatorButton,
    onToggleItem,
    children,
    selected,
    selectable,
    ref,
    className,
    expand,
    rowClick,
    style,
    hover,
    ...rest
}: CustomDatagridRowProps) => {
    const context = useDatagridContext()
    const navigate = useNavigate()
    const createPath = useCreatePath()
    const resource = useResourceContext({
        record,
        id,
        hasBulkActions,
        showCalculatorButton,
        onToggleItem,
        children,
        selected,
        selectable,
        ref,
        className,
        expand,
        rowClick,
        style,
        hover,
        ...rest
    })
    const expandable = (!context || !context.isRowExpandable || (record && context.isRowExpandable(record))) && expand
    const [, toggleExpanded] = useExpanded(resource as string, id as Identifier, context && context.expandSingle)
    const handleToggleExpand = useCallback(
        (event) => {
            toggleExpanded()
            event.stopPropagation()
        },
        [toggleExpanded]
    )
    const handleToggleSelection = useCallback(
        (event) => {
            if (!selectable) return
            if (onToggleItem && id) onToggleItem(id, event)
            event.stopPropagation()
        },
        [id, onToggleItem, selectable]
    )
    const handleClick = useCallback(
        async (event) => {
            event.persist()
            const type: string | boolean =
                typeof rowClick === "function" && record
                    ? await rowClick(id as Identifier, resource as string, record)
                    : (rowClick as string)
            if (type === false || type == null) {
                return
            }
            if (["edit", "show"].includes(type)) {
                navigate(createPath({ resource, id, type }))
                return
            }
            if (type === "expand") {
                handleToggleExpand(event)
                return
            }
            if (type === "toggleSelection") {
                handleToggleSelection(event)
                return
            }
            navigate(type)
        },
        [rowClick, id, resource, record, navigate, createPath, handleToggleExpand, handleToggleSelection]
    )

    return id ? (
        <RecordContextProvider value={record}>
            <TableRow
                sx={{
                    ":focus": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)"
                    }
                }}
                ref={ref}
                className={clsx(className, {
                    [DatagridClasses.expandable]: expandable,
                    [DatagridClasses.selectable]: selectable,
                    [DatagridClasses.clickableRow]: typeof rowClick === "function" ? true : rowClick
                })}
                key={id}
                style={style}
                hover={hover}
                {...rest}
            >
                {/* First column: row button, checkbox, PDF button, and optional calculator button */}
                <TableCell padding="none">
                    <Box display="flex" padding="0em 0em 0em 0.53em" height="100%">
                        <Button
                            sx={{
                                display: "flex",
                                flexGrow: "1",
                                position: "absolute",
                                left: 0,
                                width: "100%",
                                height: "100%",
                                alignItems: "stretch",
                                backgroundColor: "transparent",
                                "&:hover": {
                                    backgroundColor: "transparent"
                                }
                            }}
                            onClick={handleClick}
                            aria-label="View or edit form"
                        />
                        {hasBulkActions && (
                            <Checkbox
                                aria-label={"Select this row"}
                                color="primary"
                                className={`select-item ${DatagridClasses.checkbox}`}
                                checked={selectable && selected}
                                onClick={handleToggleSelection}
                                disabled={!selectable}
                                sx={{ alignItems: "start", padding: "0.4em 0.6em" }}
                            />
                        )}
                        <Box width="100%" justifyContent="center" alignSelf="center">
                            <Box display="flex">
                                <PdfButtonField />
                                {showCalculatorButton && <CalculatorButtonField />}
                            </Box>
                        </Box>
                    </Box>
                </TableCell>
                {React.Children.map(children, (field, index) =>
                    isValidElement(field) ? (
                        <DatagridCell
                            placeholder="—"
                            key={`${id}-${(field.props as any).source || index}`}
                            className={clsx(`column-${(field.props as any).source}`, DatagridClasses.rowCell)}
                            record={record}
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                            {...{ field, resource, rest }}
                        />
                    ) : null
                )}
            </TableRow>
        </RecordContextProvider>
    ) : null
}

export default DatagridRow
