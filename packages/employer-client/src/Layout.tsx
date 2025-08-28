import { HorizontalMenu } from "@react-admin/ra-navigation"
import { ReactQueryDevtools } from "react-query/devtools"
import { CustomContainerLayout } from "./CustomContainerLayout"

// eslint-disable-next-line import/no-anonymous-default-export
export default (props: any) => {
    const itemStyle = {
        backgroundColor: "#5a7daa",
        height: "100%",
        paddingLeft: 35,
        paddingRight: 35,
        fontSize: "14px"
    }
    return (
        // use a custom ContainerLayout implementation in order to be able to display two headers
        <>
            <CustomContainerLayout
                {...props}
                maxWidth="xl"
                menu={
                    <HorizontalMenu indicatorColor="secondary">
                        <HorizontalMenu.Item
                            label="Applications"
                            to="/applications"
                            value="applications"
                            style={itemStyle}
                        />
                        <HorizontalMenu.Item label="Claim Forms" to="/claims" value="claims" style={itemStyle} />
                    </HorizontalMenu>
                }
                userMenu={true}
            />
            <ReactQueryDevtools initialIsOpen={false} />
        </>
    )
}
