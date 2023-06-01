import { ContainerLayout, Header, HorizontalMenu } from "@react-admin/ra-navigation"
import { Layout, LayoutProps } from "react-admin"
import { AppBar } from "react-admin"
import { RefreshIconButton } from "react-admin"
import { ReactQueryDevtools } from "react-query/devtools"
import { Box, Typography } from "@mui/material"
import KitchenIcon from "@mui/icons-material/Kitchen"
import Logo from "./Logo"
import Tag from "./Tag"

// eslint-disable-next-line import/no-anonymous-default-export
export default (props: any) => {
    return (
        <>
            <ContainerLayout
                {...props}
                maxWidth="xl"
                // menu={
                //     <HorizontalMenu>
                //         <HorizontalMenu.Item label="Applications" to="/wage" value="wage" style={{ backgroundColor: "#5a7daa", height: "100%", paddingRight: 35, paddingLeft: 35 }}/>
                //         <HorizontalMenu.Item label="Claim Forms" to="/claims" value="claims" style={{ backgroundColor: "#5a7daa", height: "100%", paddingRight: 35, paddingLeft: 35 }} />
                //     </HorizontalMenu>
                // }
                // toolbar={
                //     <Box display="flex" gap={1} mr={1}>
                //     </Box>
                // }
                //toolbar={}
            />
            <ReactQueryDevtools initialIsOpen={false} />
        </>
    )
}
