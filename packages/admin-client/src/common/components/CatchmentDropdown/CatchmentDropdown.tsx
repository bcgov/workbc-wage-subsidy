import { MenuItem, Select } from "@mui/material"
import { COLOURS } from "../../../Colours"

interface Catchment {
    id: number
    name: string
}

interface CatchmentDropdownProps {
    catchments: Catchment[]
    value: number
    onChange: (event: any) => void
}

const CatchmentDropdown: React.FC<CatchmentDropdownProps> = ({ catchments, value, onChange }) => {
    const handleChange = (event: any) => {
        onChange(event)
    }

    return (
        <Select
            value={value}
            onChange={handleChange}
            displayEmpty
            renderValue={() => "Select Catchment"}
            sx={{
                width: "14em",
                height: "3em",
                backgroundColor: COLOURS.LIGHTBLUE_TRANSLUCENT,
                borderTopLeftRadius: "6px",
                borderTopRightRadius: "6px",
                borderBottomLeftRadius: "0px",
                borderBottomRightRadius: "0px",
                borderTop: "2px solid transparent",
                borderLeft: "2px solid transparent",
                borderRight: "2px solid transparent",
                borderBottom: "3px solid #313132",
                marginLeft: "auto",
                ":hover": {
                    borderTop: "2px solid #313132",
                    borderLeft: "2px solid #313132",
                    borderRight: "2px solid #313132"
                },
                // Disable default 'notched' outline.
                "& .MuiOutlinedInput-notchedOutline": {
                    border: "none"
                }
            }}
        >
            {catchments.map((catchment) => (
                <MenuItem key={catchment.id} value={catchment.id}>
                    {catchment.name}
                </MenuItem>
            ))}
        </Select>
    )
}

export default CatchmentDropdown
