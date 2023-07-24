import { Box, ListItemText, MenuItem, MenuList } from "@mui/material"
import isEqual from "lodash/isEqual"
import { Count, useListContext, useRedirect, useStore } from "react-admin"

import { claimStatusFilters } from "./ClaimList"
import { useEffect } from "react"

export const ClaimListAside = () => {
    const [statusFilter, setStatusFilter] = useStore<any>("resources.claims.list.statusFilter", claimStatusFilters.All)

    const { total, isFetching } = useListContext()
    const redirect = useRedirect()

    useEffect(() => {
        // If we just fetched list data and no records were obtained, redirect to ClaimCreate page.
        if (!isFetching && statusFilter.label === "All" && total === 0) {
            redirect("create", "claims")
        }
    }, [isFetching])

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
