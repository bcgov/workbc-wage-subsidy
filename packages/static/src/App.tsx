import "./App.css"
import { motion } from "framer-motion"
import Header from "./components/Header"

function App() {
    return (
        <div className="App">
            <Header />
            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="leading-banner"
            >
                <h1>WorkBC Wage Subsidy</h1>
                <p>
                    {" "}
                    The WorkBC Wage Subsidy program provides funding to eligible employers to hire, provide work
                    experience and on-the-job training to unemployed British Columbians.
                </p>
            </motion.div>

            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="main-content"
            >
                <div>
                    <p>Wage subsidy offers employers:</p>
                    <ul>
                        <li>A portion of employee wages</li>
                        <li>Support for ongoing operations and expansion</li>
                        <li>Disability supports to reduce work-related barriers for an employee</li>
                        <li>An opportunity to:</li>
                        <ul>
                            <li>Re-hire laid off employees</li>
                            <li>Hire new employees</li>
                            <li>Better connect job seekers and employers to meet hiring needs</li>
                        </ul>
                        <li>Job Seeker Eligibility: All residents of B.C. who are not employed at all</li>
                    </ul>
                </div>
                <div>
                    <p>
                        In order to submit your application for Wage Subsidy, you will need the following information:
                    </p>
                    <ul>
                        <li>Your CRA Business Number</li>
                        <li>Your employee’s e-mail address (if you have an employee)</li>
                    </ul>
                </div>
            </motion.div>

            <div className="card-container">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="card"
                >
                    <h2>Are you an employer?</h2>
                    <p>
                        If you are an employer, you can apply for the WorkBC Wage Subsidy program. You will need to
                        provide information about your business and the employees you want to hire.
                    </p>
                    <button
                        className="BC-Gov-PrimaryButton"
                        type="button"
                        onClick={() => window.open("https://wage-sub-dev-employer.es.workbc.ca")}
                    >
                        Go to Application
                    </button>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="card"
                >
                    <h2>Are you a Service Provider?</h2>
                    <p>If you are a Service Provider, you can use the following button to access the application.</p>
                    <button
                        className="BC-Gov-PrimaryButton"
                        type="button"
                        onClick={() => window.open("https://wage-sub-dev-sp.es.workbc.ca")}
                    >
                        Go to Application
                    </button>
                </motion.div>
            </div>

            <footer className="footer">
                <div className="container">
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="https://www2.gov.bc.ca/gov/content/home/disclaimer">Disclaimer</a>
                        </li>
                        <li>
                            <a href="https://www2.gov.bc.ca/gov/content/home/privacy">Privacy</a>
                        </li>
                        <li>
                            <a href="https://www2.gov.bc.ca/gov/content/home/accessible-government">Accessibility</a>
                        </li>
                        <li>
                            <a href="https://www2.gov.bc.ca/gov/content/home/copyright">Copyright</a>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    )
}

export default App
