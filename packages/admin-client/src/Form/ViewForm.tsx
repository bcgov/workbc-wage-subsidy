/* eslint-disable jsx-a11y/iframe-has-title */
import { Box } from "@mui/material"
import { useState } from "react"
import { useParams } from "react-router"

export const ViewForm = () => {
    const [iframeLoaded, setIframeLoaded] = useState<boolean>(false)
    const { urlType, formId } = useParams()
    if (!urlType || !formId) {
        return <span />
    }

    let formUrl
    if (urlType === "View") formUrl = process.env.REACT_APP_VIEW_URL + formId
    if (urlType === "Draft") formUrl = process.env.REACT_APP_DRAFT_URL + formId

    return (
        <Box style={{ position: "relative", marginTop: 7 }}>
            {iframeLoaded ? (
                <div
                    style={{ backgroundColor: "white", width: "100%", height: "70px", position: "absolute", zIndex: 1 }}
                >
                    &nbsp;
                </div>
            ) : (
                <span>Loading. . .</span>
            )}
            <iframe
                src={formUrl}
                style={{ border: "0", width: "100%", height: "175em", overflow: "hidden" }}
                onLoad={(e) => {
                    setIframeLoaded(true)
                }}
                scrolling="no"
            />
            <div
                className="bottom-hider"
                style={{
                    backgroundColor: "white",
                    width: "100%",
                    height: "110px",
                    position: "absolute",
                    zIndex: 1,
                    bottom: 0
                }}
            >
                &nbsp;
            </div>
        </Box>
    )
}
