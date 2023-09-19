import { Box, MenuItem, Select } from "@mui/material"
import { useState } from "react"
import { COLOURS } from "../../../Colours"

const outlineStyles = {
    noOutline: { border: "2px solid transparent" },
    solidOutline: { border: "2px solid #313132" }
}

const styles = {
    // Disable default 'notched' outline.
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    marginLeft: "auto",
    width: "9em",
    height: "3em",
    backgroundColor: COLOURS.LIGHTBLUE_TRANSLUCENT,
    borderRadius: "6px",
    border: outlineStyles.noOutline,
    ":hover": outlineStyles.solidOutline
}

interface StatusDropdownProps {
    record: any
    onChange: (record: any, newStatus: any) => void
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ record, onChange }) => {
    const [outline, setOutline] = useState(outlineStyles.noOutline)
    const statuses = [
        { label: "New", status: "New" },
        { label: "In Progress", status: "In Progress" },
        { label: "Completed", status: "Completed" },
        { label: "Cancelled", status: "Cancelled" }
    ]
    const choices = {
        New: [statuses[0], statuses[1], statuses[3]],
        Cancelled: [statuses[1], statuses[3]],
        "In Progress": [statuses[1], statuses[2], statuses[3]],
        Completed: [statuses[1], statuses[2]]
    }

    return (
        <Box display="flex" width="100%" justifyContent="center">
            <Select
                value={record.status}
                onChange={(event) => onChange(record, event.target.value)}
                displayEmpty
                renderValue={() => record.status}
                onFocus={() => setOutline(outlineStyles.solidOutline)}
                onBlur={() => setOutline(outlineStyles.noOutline)}
                sx={{ ...styles, ...outline }}
            >
                {choices[record.status].map((status) => (
                    <MenuItem key={status.status} value={status.status}>
                        <span aria-hidden={true}>{status.label}</span>
                    </MenuItem>
                ))}
            </Select>
        </Box>
    )
}

export default StatusDropdown
