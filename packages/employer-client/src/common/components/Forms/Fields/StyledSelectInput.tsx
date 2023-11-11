import { SxProps, Theme } from "@mui/material"
import { SelectInput } from "react-admin"

interface StyledSelectInputProps {
    source: string
    label: string
    choices: any[]
    disabled?: boolean | undefined
    sx?: SxProps<Theme> | undefined
}

const StyledSelectInput: React.FC<StyledSelectInputProps> = ({ source, label, choices, disabled, sx }) => {
    return (
        <SelectInput
            source={source}
            label={label}
            disabled={disabled}
            placeholder=""
            InputProps={{
                notched: false
            }}
            InputLabelProps={{
                shrink: true,
                style: {
                    color: "#313132",
                    transform: "translate(0em, -1.5em) scale(1)"
                }
            }}
            sx={sx}
            choices={choices}
        />
    )
}

export default StyledSelectInput
