// import { makeStyles } from "@material-ui/core/styles"
import { BottomNavigation, BottomNavigationAction, Box, Divider } from "@mui/material"
import { StyledEngineProvider } from "@mui/material/styles"

/*
const useStyles = makeStyles({
  root: {
    width: '100%',
    backgroundColor: '#003366',
    borderTop: '3px solid #FCBA19',
    justifyContent: 'center'
  },
  label: {
    '&:hover': {
      textDecoration: 'underline #fff'
    }
  }
})
*/

const labelStyle = {
    "&:hover": {
        textDecoration: "underline #fff"
    }
}

// Wrap divider, discarding received props. Prevent error raised when props applied to DOM elements.
const WrappedDivider = (props: any) => <Divider orientation="vertical" variant="middle" color="grey" flexItem />

function Footer() {
    // const classes = useStyles()
    return (
        <StyledEngineProvider injectFirst>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#003366",
                    justifyContent: "center",
                    padding: "0px"
                }}
            >
                <BottomNavigation
                    showLabels
                    sx={{
                        width: "100%",
                        backgroundColor: "#003366",
                        borderTop: "3px solid #FCBA19",
                        justifyContent: "center",
                        "& .MuiBottomNavigationAction-label": {
                            fontSize: 17,
                            color: "#FFFFFF"
                        }
                    }}
                >
                    <BottomNavigationAction
                        sx={labelStyle}
                        label="BC Government"
                        href="https://www2.gov.bc.ca/gov/content/home"
                    />
                    <WrappedDivider />
                    <BottomNavigationAction
                        sx={labelStyle}
                        label="Disclaimer"
                        href="https://www2.gov.bc.ca/gov/content/home/disclaimer"
                    />
                    <WrappedDivider />
                    <BottomNavigationAction
                        sx={labelStyle}
                        label="Privacy"
                        href="https://www2.gov.bc.ca/gov/content/home/privacy"
                    />
                    <WrappedDivider />
                    <BottomNavigationAction
                        sx={labelStyle}
                        label="Accessibility"
                        href="https://www2.gov.bc.ca/gov/content/home/accessibility"
                    />
                    <WrappedDivider />
                    <BottomNavigationAction
                        sx={labelStyle}
                        label="Copyright"
                        href="https://www2.gov.bc.ca/gov/content/home/copyright"
                    />
                </BottomNavigation>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        color: "#FFFFFF",
                        paddingTop: "1em",
                        paddingBottom: "2em"
                    }}
                >
                    <Box sx={{ maxWidth: "80em" }}>
                        <span>
                            The B.C. Public Service acknowledges the territories of First Nations around B.C. and is
                            grateful to carry out our work on these lands. We acknowledge the rights, interests,
                            priorities, and concerns of all Indigenous Peoples - First Nations, Métis, and Inuit -
                            respecting and acknowledging their distinct cultures, histories, rights, laws, and
                            governments.
                        </span>
                    </Box>
                </Box>
            </Box>
        </StyledEngineProvider>
    )
}
export default Footer
