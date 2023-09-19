import { Box, ListItemText, MenuItem, MenuList } from "@mui/material"
import { Count, useDataProvider, useListContext, useRedirect } from "react-admin"
import isEqual from "lodash/isEqual"
import { ScreenReaderOnly } from "../../styles/ScreenReaderOnly"
import { useEffect, useState } from "react"
import { COLOURS } from "../../../Colours"

interface ListAsideProps {
    statusFilters: { [key: string]: any }
    statusFilter: any
    setStatusFilter: React.Dispatch<any>
    user: string
}

export const ListAside: React.FC<ListAsideProps> = ({ statusFilters, statusFilter, setStatusFilter, user }) => {
    const { resource, total, isFetching } = useListContext()
    const dataProvider = useDataProvider()
    const redirect = useRedirect()
    const [counts, setCounts] = useState<any>(
        Object.entries(statusFilters).reduce((acc: any, [key, val]) => {
            acc[val?.status ? val.status : "All"] = 0
            return acc
        }, {} as Record<string, number>)
    )

    const skipToDatagrid = (event: any) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            const element = document.getElementById("datagrid")
            element?.focus()
        }
    }

    const getCounts = () => {
        dataProvider.getCounts(resource).then(({ data }) => {
            const total = data.reduce((acc, val) => acc + Number(Object(val).count), 0)
            const byStatus = data.reduce((acc, val) => {
                acc[val.status] = Number(val.count)
                return acc
            }, {} as Record<string, number>)
            setCounts({ All: total, ...byStatus })
        })
    }

    useEffect(() => {
        if (isFetching) {
            getCounts()
        }
        if (!isFetching && statusFilter.label === "All" && total === 0) {
            setStatusFilter(statusFilters["All"])
            redirect("create", resource)
        }
    }, [isFetching])

    useEffect(() => {
        getCounts()
    }, [])

    return (
        <Box width={200} mr={1} mt={7} flexShrink={0} order={-1}>
            <MenuList aria-label="status filters" id="list-aside" tabIndex={0} onKeyDown={skipToDatagrid}>
                {Object.keys(statusFilters).map((key) => (
                    <MenuItem
                        key={key}
                        onClick={() => {
                            setStatusFilter(statusFilters[key])
                        }}
                        selected={isEqual(statusFilter, statusFilters[key])}
                    >
                        <ListItemText aria-hidden={true}>{statusFilters[key].label}</ListItemText>
                        <span style={ScreenReaderOnly}>{"status: " + statusFilters[key].label + ", count: "}</span>
                        <span style={{ color: COLOURS.MEDIUMGREY }}>
                            {statusFilters[key].label === "All"
                                ? counts["All"]
                                : statusFilters[key].status in counts
                                ? counts[statusFilters[key].status]
                                : "0"}
                        </span>
                        <span style={ScreenReaderOnly}>
                            {isEqual(statusFilter, statusFilters[key]) ? ", selected" : ", unselected"}
                        </span>
                    </MenuItem>
                ))}
            </MenuList>
        </Box>
    )
}
