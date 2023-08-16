import * as React from "react"
import { SVGProps } from "react"

const Logo = (props: SVGProps<SVGSVGElement>) => {
    return (
        <a href="https://www.workbc.ca/">
            <img
                src={"https://apply.workbc.ca/Content/images/Govt/WorkBC_lrg_RGB_rev.svg"}
                height="52"
                alt="Work BC Homepage"
            />
        </a>
    )
}

export default Logo
