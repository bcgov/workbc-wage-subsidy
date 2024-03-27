import { Box } from "@mui/material"
import { TopToolbar } from "react-admin"
import NotifyButton from "../NotifyButton/NotifyButton"
import CatchmentDropdown from "../CatchmentDropdown/CatchmentDropdown"

interface ListActionProps {
    catchment: number
}

export const ListActions: React.FC<ListActionProps> = ({ catchment }) => {
    return (
        <TopToolbar>
            <Box display="flex" alignItems="end">
                {catchment > 0 && <NotifyButton />}
                <CatchmentDropdown />
            </Box>
        </TopToolbar>
    )
}
