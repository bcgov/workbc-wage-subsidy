import { Box, ListItemText, MenuItem, MenuList } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { CatchmentContext } from "../../contexts/CatchmentContext/CatchmentContext"
import { LoadingIndicator, useDataProvider, useListContext } from "react-admin"
import isEqual from "lodash/isEqual"
import { ScreenReaderOnly } from "../../styles/ScreenReaderOnly"
import { COLOURS } from "../../../Colours"
import "../CatchmentLabel/CatchmentLabel.css"

interface ListAsideProps {
    statusFilters: { [key: string]: any }
    statusFilter: any
    setStatusFilter: React.Dispatch<any>
}

export const ListAside: React.FC<ListAsideProps> = ({ statusFilters, statusFilter, setStatusFilter }) => {
    const cc = useContext(CatchmentContext)
    const { resource, isFetching } = useListContext()
    const dataProvider = useDataProvider()
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
        dataProvider.getCounts(resource, { filter: { catchmentno: cc.catchment.id } }).then(({ data }) => {
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
    }, [isFetching])

    useEffect(() => {
        getCounts()
    }, [])

    useEffect(() => {
        // When catchment is changed, set status filter to 'All'.
        setStatusFilter(statusFilters["All"])
    }, [cc.catchment])

    return (
        <Box width={200} mr={1} mt={7} flexShrink={0} order={-1} style={{ transform: "translate(0em, -1.7em)" }}>
            <Box width="30em" style={{ transform: "translate(0em, -0.5em)" }}>
                <span className="catchment-label" aria-hidden={true}>
                    Status Filter
                </span>
            </Box>
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
                                : statusFilters[key].label in counts
                                ? counts[statusFilters[key].label]
                                : "0"}
                        </span>
                        <span style={ScreenReaderOnly}>
                            {isEqual(statusFilter, statusFilters[key]) ? ", selected" : ", not selected"}
                        </span>
                    </MenuItem>
                ))}
            </MenuList>
        </Box>
    )
}
