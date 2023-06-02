import Card from "./common/Card/Card"

const ServiceProviderCard = () => (
    <Card>
        <h2>Are you a WorkBC Service Provider?</h2>
        <p>If you are a WorkBC Service Provider, log in here</p>
        <button
            className="BC-Gov-PrimaryButton"
            type="button"
            onClick={() => window.open("https://wage-sub-dev-sp.es.workbc.ca")}
        >
            Service Provider Login
        </button>
    </Card>
)

export default ServiceProviderCard
