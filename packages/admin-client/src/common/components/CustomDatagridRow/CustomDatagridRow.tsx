import React, { isValidElement, useState, useEffect, useCallback, memo, FC, ReactElement } from "react"
import PropTypes from "prop-types"
import clsx from "clsx"
import { TableCell, TableRow, TableRowProps, Checkbox, Box, Button } from "@mui/material"
import {
    Identifier,
    RaRecord,
    RecordContextProvider,
    shallowEqual,
    useExpanded,
    useResourceContext,
    useTranslate,
    useCreatePath,
    useRecordContext
} from "ra-core"
import { useNavigate } from "react-router-dom"

import { DatagridCell } from "react-admin"
import { DatagridClasses } from "react-admin"
import { useDatagridContext } from "react-admin"
import PdfButtonField from "../PdfButtonField/PdfButtonField"
import CalculatorButtonField from "../CalculatorButtonField/CalculatorButtonField"

const computeNbColumns = (expand, children, hasBulkActions) =>
    expand
        ? 1 + // show expand button
          (hasBulkActions ? 1 : 0) + // checkbox column
          React.Children.toArray(children).filter((child) => !!child).length // non-null children
        : 0 // we don't need to compute columns if there is no expand panel;

type CustomDatagridRowProps = DatagridRowProps & {
    showCalculatorButton?: boolean
}

const DatagridRow: FC<CustomDatagridRowProps> = React.forwardRef((props, ref) => {
    // const DatagridRow: FC<DatagridRowProps> = React.forwardRef((props, ref) => {
    const {
        showCalculatorButton,
        children,
        className,
        expand,
        hasBulkActions,
        hover,
        id,
        onToggleItem,
        record: recordOverride,
        rowClick,
        selected,
        style,
        selectable,
        ...rest
    } = props

    const context = useDatagridContext()
    const translate = useTranslate()
    const record = useRecordContext(props)
    const expandable = (!context || !context.isRowExpandable || context.isRowExpandable(record)) && expand
    const resource = useResourceContext(props)
    const createPath = useCreatePath()
    const [expanded, toggleExpanded] = useExpanded(resource, id as Identifier, context && context.expandSingle)
    const [nbColumns, setNbColumns] = useState(() => computeNbColumns(expandable, children, hasBulkActions))
    useEffect(() => {
        // Fields can be hidden dynamically based on permissions;
        // The expand panel must span over the remaining columns
        // So we must recompute the number of columns to span on
        const newNbColumns = computeNbColumns(expandable, children, hasBulkActions)
        if (newNbColumns !== nbColumns) {
            setNbColumns(newNbColumns)
        }
    }, [expandable, nbColumns, children, hasBulkActions])

    const navigate = useNavigate()

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
            const type = typeof rowClick === "function" ? await rowClick(id as Identifier, resource, record) : rowClick
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

    return (
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
                    <Box display="flex" padding="0em 0em 0em 0.53em" minHeight="2.6em">
                        <Button
                            sx={{
                                position: "absolute",
                                width: "99%",
                                height: "3em",
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
                                aria-label={translate("ra.action.select_row", {
                                    _: "Select this row"
                                })}
                                color="primary"
                                className={`select-item ${DatagridClasses.checkbox}`}
                                checked={selectable && selected}
                                onClick={handleToggleSelection}
                                disabled={!selectable}
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
                            key={`${id}-${(field.props as any).source || index}`}
                            className={clsx(`column-${(field.props as any).source}`, DatagridClasses.rowCell)}
                            record={record}
                            {...{ field, resource }}
                        />
                    ) : null
                )}
            </TableRow>
        </RecordContextProvider>
    )
})

DatagridRow.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    // @ts-ignore
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool.isRequired,
    hover: PropTypes.bool,
    id: PropTypes.any,
    onToggleItem: PropTypes.func,
    // @ts-ignore
    record: PropTypes.object,
    resource: PropTypes.string,
    // @ts-ignore
    rowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.bool]),
    selected: PropTypes.bool,
    style: PropTypes.object,
    selectable: PropTypes.bool
}

DatagridRow.defaultProps = {
    hasBulkActions: false,
    hover: true,
    selected: false,
    selectable: true
}

export interface DatagridRowProps extends Omit<TableRowProps, "id" | "classes"> {
    className?: string
    expand?:
        | ReactElement
        | FC<{
              id: Identifier
              record: RaRecord
              resource: string
          }>
    hasBulkActions?: boolean
    hover?: boolean
    id?: Identifier
    onToggleItem?: (id: Identifier, event: React.TouchEvent | React.MouseEvent) => void
    record?: RaRecord
    resource?: string
    rowClick?: RowClickFunction | string | false
    selected?: boolean
    style?: any
    selectable?: boolean
}

export type RowClickFunction = (
    id: Identifier,
    resource: string,
    record: RaRecord
) => string | false | Promise<string | false>

const areEqual = (prevProps, nextProps) => {
    const { children: _1, expand: _2, ...prevPropsWithoutChildren } = prevProps
    const { children: _3, expand: _4, ...nextPropsWithoutChildren } = nextProps
    return shallowEqual(prevPropsWithoutChildren, nextPropsWithoutChildren)
}

export const PureDatagridRow = memo(DatagridRow, areEqual)

PureDatagridRow.displayName = "PureDatagridRow"

export default DatagridRow
