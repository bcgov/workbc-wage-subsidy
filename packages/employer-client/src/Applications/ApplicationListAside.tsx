import { Box, ListItemText, MenuItem, MenuList } from "@mui/material"
import isEqual from "lodash/isEqual"
import { Count, useListContext, useStore, useRedirect } from "react-admin"

import { applicationStatusFilters } from "./ApplicationList"
import { useEffect } from "react"
import { ScreenReaderOnly } from "../common/styles/ScreenReaderOnly"

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

    const skipToDatagrid = (event: any) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            const element = document.getElementById("datagrid")
            element?.focus()
        }
    }

    return (
        <Box width={200} mr={1} mt={7} flexShrink={0} order={-1}>
            <MenuList aria-label="status filters" id="list-aside" tabIndex={0} onKeyDown={skipToDatagrid}>
                {Object.keys(applicationStatusFilters).map((key) => (
                    <MenuItem
                        key={key}
                        onClick={() => setStatusFilter(applicationStatusFilters[key])}
                        selected={isEqual(statusFilter, applicationStatusFilters[key])}
                    >
                        <ListItemText aria-hidden={true}>{applicationStatusFilters[key].label}</ListItemText>
                        <span style={ScreenReaderOnly}>
                            {"status: " + applicationStatusFilters[key].label + ", count: "}
                        </span>
                        <Count filter={applicationStatusFilters[key]} color="text.disabled" />
                    </MenuItem>
                ))}
            </MenuList>
        </Box>
    )
}
