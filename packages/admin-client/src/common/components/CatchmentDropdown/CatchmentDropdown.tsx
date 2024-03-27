import { MenuItem, Select } from "@mui/material"
import { COLOURS } from "../../../Colours"
import { useContext, useEffect, useState } from "react"
import { CatchmentContext } from "../../contexts/CatchmentContext/CatchmentContext"
import { ScreenReaderOnly } from "../../styles/ScreenReaderOnly"

const outlineStyles = {
    noOutline: { border: "2px solid transparent" },
    solidOutline: { border: "2px solid #313132" }
}

const styles = {
    // Disable default 'notched' outline.
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    marginLeft: "auto",
    width: "14em",
    height: "3em",
    backgroundColor: COLOURS.LIGHTBLUE_TRANSLUCENT,
    borderRadius: "6px",
    border: outlineStyles.noOutline,
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
        return cc.catchments.some((item) => item.id === cc.catchment.id)
    }

    // For MUI Select component, "" is the value for no selection.
    const [value, setValue] = useState("" as number | "")
    useEffect(() => {
        setValue(valueExists() ? cc.catchment.id : "")
    }, [cc.catchment])

    return (
        <Select
            value={value}
            onChange={handleChange}
            displayEmpty
            renderValue={() => cc.catchment.name}
            // This component receives keyboard focus via a subcomponent.
            // To detect keyboard focus from here, we must use onFocus(), onBlur().
            onFocus={() => setOutline(outlineStyles.solidOutline)}
            onBlur={() => setOutline(outlineStyles.noOutline)}
            sx={{ ...styles, ...outline }}
        >
            {cc.catchments.map((catchment) => (
                <MenuItem key={catchment.id} value={catchment.id} selected={value === catchment.id}>
                    <span style={ScreenReaderOnly}>{"Catchment " + catchment.name}</span>
                    <span aria-hidden={true}>{catchment.name}</span>
                </MenuItem>
            ))}
        </Select>
    )
}

export default CatchmentDropdown
