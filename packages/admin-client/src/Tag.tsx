import "./Tag.css"

const Tag = () => {
    return (
        <div aria-label="The type of the current app" className="Beta-PhaseBanner">
            {process.env.REACT_APP_ENVIRONMENT || "Beta"}
        </div>
    )
}

export default Tag
