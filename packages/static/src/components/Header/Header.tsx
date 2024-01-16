import "./Header.css"

const Header = () => (
    <header>
        <div className="banner">
            <img
                src="https://apply.workbc.ca/Content/images/Govt/WorkBC_lrg_RGB_rev.svg"
                height="52"
                alt="Work BC Logo"
                style={{ marginTop: "-8px" }}
            />
            <h2>WorkBC Wage Subsidy</h2>
            <div aria-label="This application is currently in Beta phase" className="Beta-PhaseBanner">
                {import.meta.env.VITE_REACT_ENVIRONMENT || "Beta"}
            </div>
        </div>
        <div className="other">
            <button
                className="ministry-login-button"
                type="button"
                onClick={() => window.open(import.meta.env.VITE_MINISTRY_URL)}
            >
                MINISTRY LOGIN
            </button>
        </div>
    </header>
)

export default Header
