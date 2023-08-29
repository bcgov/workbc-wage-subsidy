import { Box } from "@mui/material"
import { TopToolbar } from "react-admin"
import NotifyButton from "../NotifyButton/NotifyButton"
import CatchmentDropdown from "../CatchmentDropdown/CatchmentDropdown"

export const ListActions = () => (
    <TopToolbar>
        <Box display="flex" alignItems="end">
            <NotifyButton />
            <CatchmentDropdown />
        </Box>
    </TopToolbar>
)
