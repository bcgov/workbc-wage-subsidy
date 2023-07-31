import { useContext, useEffect } from "react"
import { CatchmentContext } from "../../contexts/CatchmentContext/CatchmentContext"
import { Count, useListContext } from "react-admin"
import { Box, ListItemText, MenuItem, MenuList } from "@mui/material"
import isEqual from "lodash/isEqual"

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

    return (
        <Box width={200} mr={1} mt={7} flexShrink={0} order={-1}>
            <MenuList>
                {Object.keys(statusFilters).map((key) => (
                    <MenuItem
                        key={key}
                        onClick={() => {
                            setFilters({ ...statusFilters[key], catchmentno: cc.catchment.id }, displayedFilters)
                        }}
                        selected={isEqual(filterValues.label, statusFilters[key].label)}
                    >
                        <ListItemText>{statusFilters[key].label}</ListItemText>
                        <Count filter={{ ...statusFilters[key], catchmentno: cc.catchment.id }} color="text.disabled" />
                    </MenuItem>
                ))}
            </MenuList>
        </Box>
    )
}
