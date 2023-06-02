import Card from "./common/Card/Card"

const EmployerCard = () => (
    <Card>
        <h2>Are you an Employer?</h2>
        <p>You will need to log in to Wage Subsidy to access:</p>
        <ul>
            <li>Applications</li>
            <li>Claim Forms</li>
        </ul>
        <p>
            You can log in with either a <strong>Basic BCeID</strong> or a <strong>Business BCeID</strong>
        </p>
        <p>More info on BCeID</p>
        <img width="100px" src="/employer.svg" alt="Employer logo" />
        <button
            className="BC-Gov-PrimaryButton"
            type="button"
            onClick={() => window.open("https://wage-sub-dev-employer.es.workbc.ca")}
        >
            Employer Login
        </button>
    </Card>
)

export default EmployerCard
