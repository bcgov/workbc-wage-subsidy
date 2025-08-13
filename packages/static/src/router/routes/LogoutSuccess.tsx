import { Box, Typography, IconButton, Tooltip } from "@mui/material"
import HomeIcon from "@mui/icons-material/Home"
import { useState, useEffect } from "react"

const LogoutSuccess = () => {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true)
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    if (!isLoaded) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="calc(100vh - 115px)"
                sx={{ p: 4 }}
            />
        )
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="calc(100vh - 115px)"
            sx={{ p: 4 }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                {`You've been successfully logged out!`}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                We hope to see you again soon.
            </Typography>
            <Tooltip title="Go to Home">
                <IconButton color="primary" href="/" aria-label="Go to home page">
                    <HomeIcon fontSize="large" />
                </IconButton>
            </Tooltip>
        </Box>
    )
}

export default LogoutSuccess
