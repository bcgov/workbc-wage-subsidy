import { Box, ListItemText, MenuItem, MenuList } from "@mui/material"
import isEqual from "lodash/isEqual"
import { Count, useStore } from "react-admin"

import { claimStatusFilters } from "./ClaimList"

export const ClaimListAside = () => {
    const [statusFilter, setStatusFilter] = useStore<any>("resources.claim.list.statusFilter", claimStatusFilters.All)
    return (
        <Box width={200} mr={1} mt={7} flexShrink={0} order={-1}>
            <MenuList>
                {Object.keys(claimStatusFilters).map((key) => (
                    <MenuItem
                        key={key}
                        onClick={() => setStatusFilter(claimStatusFilters[key])}
                        selected={isEqual(statusFilter, claimStatusFilters[key])}
                    >
                        <ListItemText>{claimStatusFilters[key].label}</ListItemText>
                        <Count filter={claimStatusFilters[key]} color="text.disabled" />
                    </MenuItem>
                ))}
            </MenuList>
        </Box>
    )
}
