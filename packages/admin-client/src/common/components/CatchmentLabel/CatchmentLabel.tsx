import "./CatchmentLabel.css"

interface CatchmentLabelProps {
    catchment: string
}

const CatchmentLabel: React.FC<CatchmentLabelProps> = ({ catchment }) => (
    <span className="catchment-label">{catchment}</span>
)

export default CatchmentLabel
