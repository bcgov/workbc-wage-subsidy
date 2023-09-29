/* eslint-disable jsx-a11y/iframe-has-title */
import { Box, Button, Tooltip } from "@mui/material"
import { useParams } from "react-router"
import { COLOURS } from "../Colours"
import BackButton from "../common/components/BackButton/BackButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpRightFromSquare } from "@fortawesome/pro-solid-svg-icons"

export const ViewForm = () => {
    const { urlType, resource, formId } = useParams()
    if (!urlType || !resource || !formId) {
        return <span />
    }

    let formUrl
    if (urlType === "View") formUrl = process.env.REACT_APP_VIEW_URL + formId
    if (urlType === "Draft") formUrl = process.env.REACT_APP_DRAFT_URL + formId

    return (
        <Box style={{ position: "relative", marginTop: 7 }}>
            <div
                style={{
                    borderBottom: "solid 2px " + COLOURS.MEDIUMGREY,
                    backgroundColor: "white",
                    width: "100%",
                    height: "5em",
                    position: "absolute",
                    zIndex: 1
                }}
            >
                <Box style={{ display: "flex", marginTop: "1em" }}>
                    <BackButton resource={resource} />
                    <Box style={{ display: "flex", width: "100%", justifyContent: "right" }}>
                        <Tooltip title="Open form in new tab">
                            <Button
                                onClick={(event) => {
                                    window.open(formUrl)
                                }}
                                sx={{ minWidth: "4em" }}
                                aria-label="Open form in new tab"
                            >
                                <FontAwesomeIcon
                                    icon={faUpRightFromSquare}
                                    size="xl"
                                    style={{ color: COLOURS.LIGHTBLUE_TEXT, padding: "0.65em 0em" }}
                                />
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>
            </div>
            <iframe
                src={formUrl}
                style={{ border: "solid 2px " + COLOURS.MEDIUMGREY, width: "100%", height: "55em" }}
            />
            <div
                className="bottom-hider"
                style={{
                    borderTop: "solid 2px " + COLOURS.MEDIUMGREY,
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
