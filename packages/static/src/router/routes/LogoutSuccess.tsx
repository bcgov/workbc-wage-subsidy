import { Box, Typography, IconButton, Tooltip } from "@mui/material"
import HomeIcon from "@mui/icons-material/Home"

const LogoutSuccess = () => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="calc(100vh - 120px)" // Assuming header and footer take up 120px
        sx={{ p: 4 }}
    >
        <Typography variant="h4" component="h1" gutterBottom>
            {`You've been successfully logged out!`}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
            We hope to see you again soon.
        </Typography>
        <Tooltip title="Go to Home">
            <IconButton color="primary" href="/">
                <HomeIcon fontSize="large" />
            </IconButton>
        </Tooltip>
    </Box>
)

export default LogoutSuccess
