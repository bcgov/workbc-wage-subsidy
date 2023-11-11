import { SVGProps } from "react"

const Logo = (props: SVGProps<SVGSVGElement>) => {
    return (
        <img
            src={"https://apply.workbc.ca/Content/images/Govt/WorkBC_lrg_RGB_rev.svg"}
            height="52"
            alt="Work BC Logo"
            style={{ marginTop: "-8px" }}
        />
    )
}

export default Logo
