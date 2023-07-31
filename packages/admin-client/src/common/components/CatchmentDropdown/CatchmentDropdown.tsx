import { MenuItem, Select } from "@mui/material"
import { COLOURS } from "../../../Colours"
import { useContext, useState } from "react"
import { CatchmentContext } from "../../contexts/CatchmentContext/CatchmentContext"

const outlineStyles = {
    noOutline: {
        borderTop: "2px solid transparent",
        borderLeft: "2px solid transparent",
        borderRight: "2px solid transparent"
    },
    solidOutline: {
        borderTop: "2px solid #313132",
        borderLeft: "2px solid #313132",
        borderRight: "2px solid #313132"
    }
}

const styles = {
    // Disable default 'notched' outline.
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    marginLeft: "auto",
    width: "14em",
    height: "3em",
    backgroundColor: COLOURS.LIGHTBLUE_TRANSLUCENT,
    borderTopLeftRadius: "6px",
    borderTopRightRadius: "6px",
    borderBottomLeftRadius: "0px",
    borderBottomRightRadius: "0px",
    borderBottom: "3px solid #313132",
    ":hover": outlineStyles.solidOutline
}

const CatchmentDropdown: React.FC = () => {
    const cc = useContext(CatchmentContext)
    const [outline, setOutline] = useState(outlineStyles.noOutline)

    const handleChange = (event: any) => {
        // Update global catchment state in catchment context.
        cc.changeCatchment(event.target.value)
    }

    const valueExists = () => {
        return cc.catchments.some((item) => item.id === cc.catchment)
    }

    return (
        <Select
            value={valueExists() ? cc.catchment : ""}
            onChange={handleChange}
            displayEmpty
            renderValue={() => "Select Catchment"}
            // This component receives keyboard focus via a subcomponent.
            // To detect keyboard focus from here, we must use onFocus(), onBlur().
            onFocus={() => setOutline(outlineStyles.solidOutline)}
            onBlur={() => setOutline(outlineStyles.noOutline)}
            sx={{ ...styles, ...outline }}
        >
            {cc.catchments.map((catchment) => (
                <MenuItem key={catchment.id} value={catchment.id}>
                    {catchment.name}
                </MenuItem>
            ))}
        </Select>
    )
}

export default CatchmentDropdown
