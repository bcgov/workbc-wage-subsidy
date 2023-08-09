import { Box, ListItemText, MenuItem, MenuList } from "@mui/material"
import { useContext, useEffect } from "react"
import { CatchmentContext } from "../../contexts/CatchmentContext/CatchmentContext"
import { Count, useListContext } from "react-admin"
import isEqual from "lodash/isEqual"
import { ScreenReaderOnly } from "../../styles/ScreenReaderOnly"

interface ListAsideProps {
    statusFilters: { [key: string]: any }
}

export const ListAside: React.FC<ListAsideProps> = ({ statusFilters }) => {
    const cc = useContext(CatchmentContext)
    const { filterValues, displayedFilters, setFilters } = useListContext()

    useEffect(() => {
        // When catchment is changed, set status filter to 'All'.
        setFilters({ ...statusFilters["All"], catchmentno: cc.catchment.id }, displayedFilters)
    }, [cc.catchment])

    const skipToDatagrid = (event: any) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            const element = document.getElementById("datagrid")
            element?.focus()
        }
    }

    return (
        <Box width={200} mr={1} mt={7} flexShrink={0} order={-1}>
            <MenuList aria-label="status filter controls" id="list-aside" tabIndex={0} onKeyDown={skipToDatagrid}>
                {Object.keys(statusFilters).map((key) => (
                    <MenuItem
                        key={key}
                        onClick={() => {
                            setFilters({ ...statusFilters[key], catchmentno: cc.catchment.id }, displayedFilters)
                        }}
                        selected={isEqual(filterValues.label, statusFilters[key].label)}
                        aria-selected={isEqual(filterValues.label, statusFilters[key].label)}
                    >
                        <ListItemText aria-hidden={true}>{statusFilters[key].label}</ListItemText>
                        <span style={ScreenReaderOnly}>{"status: " + statusFilters[key].label + ", count: "}</span>
                        <Count filter={{ ...statusFilters[key], catchmentno: cc.catchment.id }} color="text.disabled" />
                    </MenuItem>
                ))}
            </MenuList>
        </Box>
    )
}
