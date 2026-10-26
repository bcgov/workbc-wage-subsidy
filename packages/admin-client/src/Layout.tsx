import { ReactQueryDevtools } from "react-query/devtools"
import { CustomContainerLayout } from "./CustomContainerLayout"
import NavigationTabs from "./NavigationTabs"

// eslint-disable-next-line import/no-anonymous-default-export
export default (props: any) => {
    const itemStyle = { backgroundColor: "#5a7daa", height: "100%", paddingLeft: 35, paddingRight: 35 }
    return (
        // use a custom ContainerLayout implementation in order to be able to display two headers
        <>
            <CustomContainerLayout
                {...props}
                maxWidth="xl"
                menu={
                    <NavigationTabs indicatorColor="secondary">
                        <NavigationTabs.Item
                            label="Applications"
                            to="/applications"
                            value="applications"
                            style={itemStyle}
                        />
                        <NavigationTabs.Item label="Claim Forms" to="/claims" value="claims" style={itemStyle} />
                    </NavigationTabs>
                }
            />
            <ReactQueryDevtools initialIsOpen={false} />
        </>
    )
}
