import { Box, ListItemText, MenuItem, MenuList } from "@mui/material"
import isEqual from "lodash/isEqual"
import { useContext } from "react"
import { Count, useListContext } from "react-admin"
import { CatchmentContext } from "../common/contexts/CatchmentContext/CatchmentContext"
import { applicationStatusFilters } from "./ApplicationList"

export const ApplicationListAside = () => {
    const cc = useContext(CatchmentContext)
    const { filterValues, displayedFilters, setFilters } = useListContext()

    return (
        <Box width={200} mr={1} mt={7} flexShrink={0} order={-1}>
            <MenuList>
                {Object.keys(applicationStatusFilters).map((key) => (
                    <MenuItem
                        key={key}
                        onClick={() => {
                            setFilters(
                                { ...applicationStatusFilters[key], ...{ catchmentno: cc.catchment.id } },
                                displayedFilters
                            )
                        }}
                        selected={isEqual(filterValues.label, applicationStatusFilters[key].label)}
                    >
                        <ListItemText>{applicationStatusFilters[key].label}</ListItemText>
                        <Count
                            filter={{ ...applicationStatusFilters[key], ...{ catchmentno: cc.catchment.id } }}
                            color="text.disabled"
                        />
                    </MenuItem>
                ))}
            </MenuList>
        </Box>
    )
}
