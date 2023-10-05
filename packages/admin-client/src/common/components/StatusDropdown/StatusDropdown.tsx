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
    width: "9em",
    height: "3em",
    backgroundColor: COLOURS.LIGHTBLUE_TRANSLUCENT,
    borderRadius: "6px",
    border: outlineStyles.noOutline,
    ":hover": outlineStyles.solidOutline
}

interface StatusDropdownProps {
    record: any
    onChange: (newStatus: any) => void
}

const StatusDropdown = ({ record, resource, onChange }) => {
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
        "In Progress": resource === "claims" ? [statuses[1], statuses[3]] : [statuses[1], statuses[2], statuses[3]],
        Completed: [statuses[1], statuses[2]]
    }

    return (
        <Box display="flex" width="100%" justifyContent="left">
            <Select
                value={record.status}
                onChange={(event) => onChange(event.target.value)}
                displayEmpty
                renderValue={() => record.status}
                onFocus={() => setOutline(outlineStyles.solidOutline)}
                onBlur={() => setOutline(outlineStyles.noOutline)}
                sx={{ ...styles, ...outline }}
                label="Status"
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
