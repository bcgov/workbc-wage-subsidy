import React from 'react'
import { makeStyles } from "@material-ui/core/styles"
import {BottomNavigation, BottomNavigationAction, Divider} from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles';


const useStyles = makeStyles({
  root: {
    width: '100%',
    backgroundColor: "#003366",
    borderTop: '3px solid #FCBA19',
    justifyContent: 'center'
    },
  label:{
    "&:hover": {
      textDecoration: "underline #fff"
      },
    },
})

function Footer() {
    const classes = useStyles()
    return (
      <StyledEngineProvider injectFirst >
        <BottomNavigation
          showLabels
          className={classes.root}
          sx={{
            "& .MuiBottomNavigationAction-label": {
              fontSize: 17,
              color: '#FFFFFF',
            },
          }}
        >
          <BottomNavigationAction className={classes.label} label="BC Government" href="https://www2.gov.bc.ca/gov/content/home"/>
          <Divider orientation="vertical" variant="middle" color="grey" flexItem></Divider>
          <BottomNavigationAction className={classes.label} label="Disclaimer" href="https://www2.gov.bc.ca/gov/content/home/disclaimer"/>
          <Divider orientation="vertical" variant="middle" color="grey" flexItem></Divider>
          <BottomNavigationAction className={classes.label} label="Privacy" href="https://www2.gov.bc.ca/gov/content/home/privacy"/>
          <Divider orientation="vertical" variant="middle" color="grey" flexItem></Divider>
          <BottomNavigationAction className={classes.label} label="Accessibility" href="https://www2.gov.bc.ca/gov/content/home/accessibility"/>
          <Divider orientation="vertical" variant="middle" color="grey" flexItem></Divider>
          <BottomNavigationAction className={classes.label} label="Copyright" href="https://www2.gov.bc.ca/gov/content/home/copyright"/>    
        </BottomNavigation>
      </StyledEngineProvider>
    )}   
export default Footer;
