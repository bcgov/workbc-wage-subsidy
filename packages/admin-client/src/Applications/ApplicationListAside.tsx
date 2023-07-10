import { Box, ListItemText, MenuItem, MenuList } from "@mui/material"
import isEqual from "lodash/isEqual"
import { useContext } from "react"
import { Count, useStore } from "react-admin"
import { CatchmentContext } from "../common/contexts/CatchmentContext/CatchmentContext"
import { applicationStatusFilters } from "./ApplicationList"

export const ApplicationListAside = () => {
    const cc = useContext(CatchmentContext)

    const [listFilter, setListFilter] = useStore("resources.applications.list.listFilter", {
        ...applicationStatusFilters["All"],
        ...{ catchmentno: cc.catchment.id }
    })

    return (
        <Box width={200} mr={1} mt={7} flexShrink={0} order={-1}>
            <MenuList>
                {Object.keys(applicationStatusFilters).map((key) => (
                    <MenuItem
                        key={key}
                        onClick={() => {
                            setListFilter({ ...applicationStatusFilters[key], ...{ catchmentno: cc.catchment.id } })
                        }}
                        selected={isEqual(listFilter.label, applicationStatusFilters[key].label)}
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
