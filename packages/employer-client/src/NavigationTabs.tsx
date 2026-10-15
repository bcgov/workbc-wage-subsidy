import { Tab, Tabs } from "@mui/material"
import { Children, CSSProperties, isValidElement, ReactElement, ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"

type NavigationTabItemProps = {
    label: string
    to: string
    value: string
    style?: CSSProperties
}

const NavigationTabItem = (_props: NavigationTabItemProps) => null

const isNavigationTabItem = (child: ReactNode): child is ReactElement<NavigationTabItemProps> =>
    isValidElement(child) && child.type === NavigationTabItem

type NavigationTabsProps = {
    indicatorColor?: "primary" | "secondary"
    children?: ReactNode
}

const matchesPath = (pathname: string, to: string) => pathname === to || pathname.startsWith(`${to}/`)

const NavigationTabsBase = ({ indicatorColor, children }: NavigationTabsProps) => {
    const { pathname } = useLocation()
    const items = Children.toArray(children).filter(isNavigationTabItem)
    const selected = items.find((item) => matchesPath(pathname, item.props.to))

    return (
        <Tabs
            value={selected ? selected.props.value : false}
            indicatorColor={indicatorColor}
            textColor="inherit"
            aria-label="Navigation Tabs"
            sx={{ minHeight: 48 }}
        >
            {items.map((item) => (
                <Tab
                    key={item.props.value}
                    component={Link}
                    label={item.props.label}
                    to={item.props.to}
                    value={item.props.value}
                    style={item.props.style}
                    sx={{ minHeight: 48 }}
                />
            ))}
        </Tabs>
    )
}

const NavigationTabs = Object.assign(NavigationTabsBase, { Item: NavigationTabItem })

export default NavigationTabs
