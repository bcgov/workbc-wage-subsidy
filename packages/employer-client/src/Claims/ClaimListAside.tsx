import { Box, ListItemText, MenuItem, MenuList } from "@mui/material"
import isEqual from "lodash/isEqual"
import { Count, useListContext, useRedirect, useStore } from "react-admin"

import { claimStatusFilters } from "./ClaimList"
import { useEffect } from "react"
import { ScreenReaderOnly } from "../common/styles/ScreenReaderOnly"

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

    const skipToDatagrid = (event: any) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            const element = document.getElementById("datagrid")
            element?.focus()
        }
    }

    return (
        <Box width={200} mr={1} mt={7} flexShrink={0} order={-1}>
            <MenuList aria-label="status filters" id="list-aside" tabIndex={0} onKeyDown={skipToDatagrid}>
                {Object.keys(claimStatusFilters).map((key) => (
                    <MenuItem
                        key={key}
                        onClick={() => setStatusFilter(claimStatusFilters[key])}
                        selected={isEqual(statusFilter, claimStatusFilters[key])}
                    >
                        <ListItemText aria-hidden={true}>{claimStatusFilters[key].label}</ListItemText>
                        <span style={ScreenReaderOnly}>{"status: " + claimStatusFilters[key].label + ", count: "}</span>
                        <Count filter={claimStatusFilters[key]} color="text.disabled" />
                    </MenuItem>
                ))}
            </MenuList>
        </Box>
    )
}
