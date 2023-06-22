import SearchIcon from "@mui/icons-material/Search"
import { Box, InputAdornment } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useTranslate } from "ra-core"

import { CommonInputProps, TextInput, TextInputProps } from "react-admin"

export const CustomSearchInput = (props: SearchInputProps) => {
    const { label, ...rest } = props

    const translate = useTranslate()

    if (label) {
        throw new Error(
            "<SearchInput> isn't designed to be used with a label prop. Use <TextInput> if you need a label."
        )
    }

    return (
        <Box paddingLeft="50.78em" zIndex="1" sx={{ transform: "translate(0em, 3.4em)" }}>
            <StyledTextInput
                hiddenLabel
                label=""
                resettable
                placeholder={translate("ra.action.search")}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="disabled" />
                        </InputAdornment>
                    )
                }}
                size="small"
                sx={{
                    borderRadius: "6px",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "transparent"
                    }
                }}
                {...rest}
            />
        </Box>
    )
}

export type SearchInputProps = CommonInputProps & TextInputProps

const PREFIX = "RaSearchInput"

const StyledTextInput = styled(TextInput, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root
})({
    marginTop: 0
})
