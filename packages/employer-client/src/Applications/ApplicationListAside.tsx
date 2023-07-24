import { Box, ListItemText, MenuItem, MenuList } from "@mui/material"
import isEqual from "lodash/isEqual"
import { Count, useListContext, useStore, useRedirect } from "react-admin"

import { applicationStatusFilters } from "./ApplicationList"
import { useEffect } from "react"

export const ApplicationListAside = () => {
    const [statusFilter, setStatusFilter] = useStore<any>(
        "resources.applications.list.statusFilter",
        applicationStatusFilters.All
    )
    const { total, isFetching } = useListContext()
    const redirect = useRedirect()

    useEffect(() => {
        // If we just fetched list data and no records were obtained, redirect to ApplicationCreate page.
        if (!isFetching && statusFilter.label === "All" && total === 0) {
            redirect("create", "applications")
        }
    }, [isFetching])

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
