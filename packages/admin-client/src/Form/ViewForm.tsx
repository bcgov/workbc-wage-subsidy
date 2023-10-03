/* eslint-disable jsx-a11y/iframe-has-title */
import { Box, Tooltip } from "@mui/material"
import { Button, useGetIdentity, useGetOne, useRefresh, useUpdate } from "react-admin"
import { useParams } from "react-router"
import StatusDropdown from "../common/components/StatusDropdown/StatusDropdown"
import { COLOURS } from "../Colours"
import BackButton from "../common/components/BackButton/BackButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpRightFromSquare } from "@fortawesome/pro-solid-svg-icons"

export const ViewForm = () => {
    const { identity } = useGetIdentity()
    const [update] = useUpdate()
    const refresh = useRefresh()
    const { urlType, resource, formId, recordId } = useParams()
    const { data: record, error } = useGetOne(resource ? resource : "", { id: recordId })
    if (error || !urlType || !resource || !formId || !recordId || !identity) {
        return <span />
    }

    let formUrl
    if (urlType === "View" && identity.idp === "idir") {
        formUrl = process.env.REACT_APP_MINISTRY_VIEW_URL + formId
    } else if (urlType === "View" && identity.idp === "bceid") {
        formUrl = process.env.REACT_APP_VIEW_URL + formId
    } else if (urlType === "Draft") {
        formUrl = process.env.REACT_APP_DRAFT_URL + formId
    } else {
        return <span />
    }

    const handleStatusChange = (newStatus) => {
        const diff = { status: newStatus }
        console.log(recordId)
        update(
            resource,
            { id: recordId, data: diff, previousData: undefined },
            {
                onSuccess: () => {
                    refresh()
                }
            }
        )
    }

    return (
        <Box style={{ position: "relative", marginTop: 7 }}>
            {record && (
                <div
                    style={{
                        borderBottom: "solid 2px " + COLOURS.MEDIUMGREY,
                        backgroundColor: "white",
                        width: "100%",
                        height: identity.idp === "idir" ? "8em" : "5em",
                        position: "absolute",
                        zIndex: 1
                    }}
                >
                    {record ? (
                        <Box style={{ display: "flex", marginTop: identity.idp === "idir" ? "4em" : "1em" }}>
                            <BackButton resource={resource} />
                            <StatusDropdown record={record} onChange={handleStatusChange} />
                            <Box style={{ display: "flex", width: "100%", justifyContent: "right" }}>
                                <Tooltip title={"Open form in new tab"}>
                                    <span>
                                        <Button
                                            onClick={(event) => {
                                                window.open(formUrl)
                                            }}
                                            sx={{ minWidth: "4em" }}
                                            aria-label="Open form in new tab"
                                        >
                                            <FontAwesomeIcon
                                                icon={faUpRightFromSquare}
                                                style={{
                                                    color: COLOURS.LIGHTBLUE_TEXT,
                                                    padding: "0.65em 0em",
                                                    height: "21px"
                                                }}
                                            />
                                        </Button>
                                    </span>
                                </Tooltip>
                            </Box>
                        </Box>
                    ) : (
                        <span />
                    )}
                    &nbsp;
                </div>
            )}
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
