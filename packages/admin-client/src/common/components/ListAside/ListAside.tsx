import { Box, ListItemText, MenuItem, MenuList } from "@mui/material"
import { useContext, useEffect } from "react"
import { CatchmentContext } from "../../contexts/CatchmentContext/CatchmentContext"
import { Count } from "react-admin"
import isEqual from "lodash/isEqual"
import { ScreenReaderOnly } from "../../styles/ScreenReaderOnly"

interface ListAsideProps {
    statusFilters: { [key: string]: any }
    statusFilter: any
    setStatusFilter: React.Dispatch<any>
}

export const ListAside: React.FC<ListAsideProps> = ({ statusFilters, statusFilter, setStatusFilter }) => {
    const cc = useContext(CatchmentContext)

    useEffect(() => {
        // When catchment is changed, set status filter to 'All'.
        setStatusFilter(statusFilters["All"])
    }, [cc.catchment])

    const skipToDatagrid = (event: any) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            const element = document.getElementById("datagrid")
            element?.focus()
        }
    }

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
                        <Count filter={{ ...statusFilters[key], catchmentno: cc.catchment.id }} color="text.disabled" />
                        <span style={ScreenReaderOnly}>
                            {isEqual(statusFilter, statusFilters[key]) ? ", selected" : ", unselected"}
                        </span>
                    </MenuItem>
                ))}
            </MenuList>
        </Box>
    )
}
