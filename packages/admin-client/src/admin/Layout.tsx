import { Layout, LayoutProps } from "react-admin"
import AppBar from "./AppBar"

// eslint-disable-next-line import/no-anonymous-default-export
const appLayout = (props: LayoutProps) => <Layout {...props} appBar={AppBar} />

export default appLayout
