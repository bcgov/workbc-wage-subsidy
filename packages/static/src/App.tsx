import "./App.css"

function App() {
    return (
        <div className="App">
            <header>
                <div className="banner">
                    <a href="https://gov.bc.ca">
                        <img
                            width="175px"
                            src="/BCID_H_rgb_rev.svg"
                            alt="Go to the Government of British Columbia website"
                        />
                    </a>
                    <h1>WorkBC Wage Subsidy</h1>
                    <div aria-label="This application is currently in Beta phase" className="Beta-PhaseBanner">
                        Beta
                    </div>
                </div>
                <div className="other">
                    {/* <!--
                        This place is for anything that needs to be right aligned
                        beside the logo.
                    --> */}
                    &nbsp;
                </div>
            </header>
            <div className="leading-banner">
                <h1>WorkBC Wage Subsidy</h1>
                <p>
                    {" "}
                    The WorkBC Wage Subsidy program provides funding to eligible employers to hire, provide work
                    experience and on-the-job training to unemployed British Columbians.
                </p>
            </div>

            <div className="main-content">
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
            </div>

            <div className="card-container">
                <div className="card">
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
                </div>
                <div className="card">
                    <h2>Are you a Service Provider?</h2>
                    <p>If you are a Service Provider, you can use the following button to access the application.</p>
                    <button
                        className="BC-Gov-PrimaryButton"
                        type="button"
                        onClick={() => window.open("https://wage-sub-dev.es.workbc.ca/sp")}
                    >
                        Go to Application
                    </button>
                </div>
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
