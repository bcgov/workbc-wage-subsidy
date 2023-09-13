import { SxProps, Theme } from "@mui/material"
import { TextInput } from "react-admin"

interface StyledTextInputProps {
    source: string
    label: string
    disabled?: boolean | undefined
    sx?: SxProps<Theme> | undefined
}

const StyledTextInput: React.FC<StyledTextInputProps> = ({ source, label, disabled, sx }) => {
    return (
        <TextInput
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
        />
    )
}

export default StyledTextInput
