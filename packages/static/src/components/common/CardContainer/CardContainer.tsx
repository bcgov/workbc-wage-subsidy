import React, { ReactNode } from "react"
import "./CardContainer.css"

interface CardContainerProps {
    children: ReactNode
}

const CardContainer: React.FC<CardContainerProps> = ({ children }) => <div className="card-container">{children}</div>

export default CardContainer
