import React from "react"
import { motion } from "framer-motion"

const Header = () => (
    <header>
        <motion.div initial={{ opacity: 1 }} whileInView={{ opacity: 1 }} className="banner">
            <a href="https://gov.bc.ca">
                <img width="175px" src="/BCID_H_rgb_rev.svg" alt="Go to the Government of British Columbia website" />
            </a>
            <h1>WorkBC Wage Subsidy</h1>
            <div aria-label="This application is currently in Beta phase" className="Beta-PhaseBanner">
                {import.meta.env.VITE_REACT_ENVIRONMENT || "Beta"}
            </div>
        </motion.div>
        <motion.div initial={{ opacity: 1 }} className="other">
            {/* <!--
            This place is for anything that needs to be right aligned
            beside the logo.
        --> */}
            &nbsp;
        </motion.div>
    </header>
)

export default Header
