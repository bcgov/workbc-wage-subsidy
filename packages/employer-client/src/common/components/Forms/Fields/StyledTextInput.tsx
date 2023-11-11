import { SxProps, Theme } from "@mui/material"
import { TextInput, Validator } from "react-admin"

interface StyledTextInputProps {
    source: string
    label: string
    disabled?: boolean | undefined
    sx?: SxProps<Theme> | undefined
    validate?: Validator | Validator[] | undefined
}

const StyledTextInput: React.FC<StyledTextInputProps> = ({ source, label, disabled, sx, validate }) => {
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
            FormHelperTextProps={{
                style: {
                    color: "#E5412C"
                }
            }}
            sx={sx}
            validate={validate}
        />
    )
}

export default StyledTextInput
