import * as React from "react"
import {
    RecordContextProvider,
    DatagridRowProps,
    DatagridClasses,
    useDatagridContext,
    Identifier,
    useResourceContext,
    useCreatePath,
    useExpanded,
    DatagridCell,
    useTranslate,
    useRecordContext
} from "react-admin"
import { TableCell, TableRow, Checkbox, Box, Button } from "@mui/material"
import clsx from "clsx"
import { isValidElement, useCallback } from "react"
import { useNavigate } from "react-router-dom"

type CustomDatagridRowProps = DatagridRowProps & {
    showCalculatorButton?: boolean
    rowAriaLabel?: string
}

const DatagridRow = React.forwardRef<HTMLTableRowElement, CustomDatagridRowProps>((props, ref) => {
    const {
        showCalculatorButton,
        hasBulkActions = false,
        rowAriaLabel,
        id,
        onToggleItem,
        children,
        selected = false,
        selectable = true,
        className,
        expand,
        rowClick,
        style,
        hover = true,
        ...rest
    } = props

    const context = useDatagridContext()
    const record = useRecordContext(props)
    const navigate = useNavigate()
    const createPath = useCreatePath()
    const translate = useTranslate()
    const resource = useResourceContext(props)
    const expandable = (!context || !context.isRowExpandable || context.isRowExpandable(record)) && expand

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
                {/* First column: row button, checkbox */}
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
                            aria-label={
                                (rowAriaLabel ? rowAriaLabel : "View or edit form") +
                                " with position title " +
                                record.position_title
                            }
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
                                sx={{ alignItems: "start", padding: "0.4em 0.6em" }}
                            />
                        )}
                    </Box>
                </TableCell>
                {React.Children.map(children, (field, index) =>
                    isValidElement(field) ? (
                        <DatagridCell
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            placeholder={undefined}
                            key={`${id}-${(field.props as any).source || index}`}
                            className={clsx(`column-${(field.props as any).source}`, DatagridClasses.rowCell)}
                            record={record}
                            {...{ field, resource }}
                            tabIndex={0}
                            aria-label={field.props.label}
                            onClick={handleClick}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleClick(e)
                                }
                            }}
                        />
                    ) : null
                )}
            </TableRow>
        </RecordContextProvider>
    )
})

export default DatagridRow
