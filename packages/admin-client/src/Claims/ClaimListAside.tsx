import { Box, ListItemText, MenuItem, MenuList } from "@mui/material"
import isEqual from "lodash/isEqual"
import { useContext, useEffect } from "react"
import { Count, useListContext } from "react-admin"
import { CatchmentContext } from "../common/contexts/CatchmentContext/CatchmentContext"
import { claimStatusFilters } from "./ClaimList"

export const ClaimListAside = () => {
    const cc = useContext(CatchmentContext)
    const { filterValues, displayedFilters, setFilters } = useListContext()

    useEffect(() => {
        // When catchment is changed, set status filter to 'All'.
        setFilters({ ...claimStatusFilters["All"], ...{ catchmentno: cc.catchment.id } }, displayedFilters)
    }, [cc.catchment])

    return (
        <Box width={200} mr={1} mt={7} flexShrink={0} order={-1}>
            <MenuList>
                {Object.keys(claimStatusFilters).map((key) => (
                    <MenuItem
                        key={key}
                        onClick={() => {
                            setFilters(
                                { ...claimStatusFilters[key], ...{ catchmentno: cc.catchment.id } },
                                displayedFilters
                            )
                        }}
                        selected={isEqual(filterValues.label, claimStatusFilters[key].label)}
                    >
                        <ListItemText>{claimStatusFilters[key].label}</ListItemText>
                        <Count
                            filter={{ ...claimStatusFilters[key], ...{ catchmentno: cc.catchment.id } }}
                            color="text.disabled"
                        />
                    </MenuItem>
                ))}
            </MenuList>
        </Box>
    )
}
