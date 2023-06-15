import { Count, useStore } from "react-admin"
import { Box, MenuList, MenuItem, ListItemText } from "@mui/material"
import isEqual from "lodash/isEqual"

import { applicationStatusFilters } from "./ApplicationList"

export const ApplicationListAside = () => {
    const [statusFilter, setStatusFilter] = useStore<any>(
        "resources.applications.list.statusFilter",
        applicationStatusFilters.All
    )
    return (
        <Box width={200} mr={1} mt={7} flexShrink={0} order={-1}>
            <MenuList>
                {Object.keys(applicationStatusFilters).map((key) => (
                    <MenuItem
                        key={key}
                        onClick={() => setStatusFilter(applicationStatusFilters[key])}
                        selected={isEqual(statusFilter, applicationStatusFilters[key])}
                    >
                        <ListItemText>{applicationStatusFilters[key].label}</ListItemText>
                        <Count filter={applicationStatusFilters[key]} color="text.disabled" />
                    </MenuItem>
                ))}
            </MenuList>
        </Box>
    )
}
