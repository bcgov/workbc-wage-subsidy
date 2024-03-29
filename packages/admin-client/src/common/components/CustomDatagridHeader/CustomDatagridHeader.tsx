import * as React from "react"
import { Children, isValidElement, useCallback } from "react"
import PropTypes from "prop-types"
import { useListContext, useResourceContext, Identifier, RaRecord, SortPayload, useTranslate } from "ra-core"
import { Box, Checkbox, TableCell, TableHead, TableRow } from "@mui/material"
import clsx from "clsx"

import { DatagridClasses } from "react-admin"
import { useDatagridContext } from "react-admin"
import CustomDatagridHeaderCell from "../CustomDatagridHeaderCell/CustomDatagridHeaderCell"

/**
 * The default Datagrid Header component.
 *
 * Renders select all checkbox as well as column header buttons used for sorting.
 */
export const CustomDatagridHeader = (props: DatagridHeaderProps) => {
    const { children, className, hasExpand = false, hasBulkActions = false, isRowSelectable } = props
    const resource = useResourceContext(props)
    const translate = useTranslate()
    const { sort, data, onSelect, selectedIds, setSort } = useListContext(props)
    const { expandSingle } = useDatagridContext()

    const updateSortCallback = useCallback(
        (event) => {
            event.stopPropagation()
            const newField = event.currentTarget.dataset.field
            const newOrder =
                sort.field === newField ? (sort.order === "ASC" ? "DESC" : "ASC") : event.currentTarget.dataset.order

            setSort({ field: newField, order: newOrder })
        },
        [sort.field, sort.order, setSort]
    )

    const updateSort = updateSortCallback

    const handleSelectAll = useCallback(
        (event) =>
            onSelect(
                event.target.checked
                    ? selectedIds.concat(
                          data
                              .filter((record) => !selectedIds.includes(record.id))
                              .filter((record) => (isRowSelectable ? isRowSelectable(record) : true))
                              .map((record) => record.id)
                      )
                    : []
            ),
        [data, onSelect, isRowSelectable, selectedIds]
    )

    const selectableIds = Array.isArray(data)
        ? isRowSelectable
            ? data.filter((record) => isRowSelectable(record)).map((record) => record.id)
            : data.map((record) => record.id)
        : []

    return (
        <TableHead className={clsx(className, DatagridClasses.thead)}>
            <TableRow className={clsx(DatagridClasses.row, DatagridClasses.headerRow)}>
                <TableCell padding="none">
                    {hasBulkActions && selectedIds && (
                        // Apply same padding that gets applied automatically to list row checkboxes.
                        <Box paddingLeft="8.48px">
                            <Checkbox
                                aria-label={translate("ra.action.select_all", {
                                    _: "Select all"
                                })}
                                className="select-all"
                                color="primary"
                                checked={
                                    selectedIds.length > 0 &&
                                    selectableIds.length > 0 &&
                                    selectableIds.every((id) => selectedIds.includes(id))
                                }
                                onChange={handleSelectAll}
                                sx={{ height: "42px", width: "42px" }}
                            />
                        </Box>
                    )}
                </TableCell>
                {Children.map(children, (field, index) =>
                    isValidElement(field) ? (
                        <CustomDatagridHeaderCell
                            className={clsx(DatagridClasses.headerCell, `column-${(field.props as any).source}`)}
                            sort={sort}
                            field={field}
                            isSorting={sort.field === ((field.props as any).sortBy || (field.props as any).source)}
                            key={(field.props as any).source || index}
                            resource={resource}
                            updateSort={updateSort}
                        />
                    ) : null
                )}
            </TableRow>
        </TableHead>
    )
}

CustomDatagridHeader.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    sort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string
    }),
    data: PropTypes.arrayOf(PropTypes.any),
    hasExpand: PropTypes.bool,
    hasBulkActions: PropTypes.bool,
    isRowSelectable: PropTypes.func,
    isRowExpandable: PropTypes.func,
    onSelect: PropTypes.func,
    onToggleItem: PropTypes.func,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    setSort: PropTypes.func
}

export interface DatagridHeaderProps<RecordType extends RaRecord = any> {
    children?: React.ReactNode
    className?: string
    hasExpand?: boolean
    hasBulkActions?: boolean
    isRowSelectable?: (record: RecordType) => boolean
    isRowExpandable?: (record: RecordType) => boolean
    size?: "medium" | "small"
    // can be injected when using the component without context
    sort?: SortPayload
    data?: RecordType[]
    onSelect?: (ids: Identifier[]) => void
    onToggleItem?: (id: Identifier) => void
    resource?: string
    selectedIds?: Identifier[]
    setSort?: (sort: SortPayload) => void
}

CustomDatagridHeader.displayName = "DatagridHeader"
