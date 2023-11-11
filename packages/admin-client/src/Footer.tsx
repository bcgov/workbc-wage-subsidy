// import { makeStyles } from "@material-ui/core/styles"
import { BottomNavigation, BottomNavigationAction, Divider } from "@mui/material"
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
const WrappedDivider = (props: any) => (
    <Divider orientation="vertical" variant="middle" color="grey" flexItem aria-hidden={true} />
)

function Footer() {
    // const classes = useStyles()
    return (
        <StyledEngineProvider injectFirst>
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
        </StyledEngineProvider>
    )
}
export default Footer
