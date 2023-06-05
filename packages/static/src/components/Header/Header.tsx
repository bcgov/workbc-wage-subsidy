import "./Header.css"

const Header = () => (
    <header>
        <div className="banner">
            <a href="https://gov.bc.ca">
                <img width="175px" src="/BCID_H_rgb_rev.svg" alt="Go to the Government of British Columbia website" />
            </a>
            <h2>WorkBC Wage Subsidy</h2>
            <div aria-label="This application is currently in Beta phase" className="Beta-PhaseBanner">
                {import.meta.env.VITE_REACT_ENVIRONMENT || "Beta"}
            </div>
        </div>
        <div className="other">
            <button
                className="ministry-login-button"
                type="button"
                onClick={() => window.open("https://www2.gov.bc.ca/gov/content/home")}
            >
                MINISTRY LOGIN
            </button>
        </div>
    </header>
)

export default Header
