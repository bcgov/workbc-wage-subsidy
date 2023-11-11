/* eslint-disable jsx-a11y/iframe-has-title */
import { Box, Tooltip } from "@mui/material"
import { Button, Loading, useGetIdentity, useGetOne, useRefresh, useUpdate } from "react-admin"
import { useParams, useLocation } from "react-router"
import StatusDropdown from "../common/components/StatusDropdown/StatusDropdown"
import { COLOURS } from "../Colours"
import BackButton from "../common/components/BackButton/BackButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpRightFromSquare } from "@fortawesome/pro-solid-svg-icons"
import { useRef, useState, useEffect } from "react"
import React from "react"

function useRecursiveTimeout(callback, delay) {
    const savedCallback = useRef(callback)

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        let id
        function tick() {
            const ret = savedCallback.current()

            if (ret instanceof Promise) {
                ret.then(() => {
                    if (delay !== null) {
                        id = setTimeout(tick, delay)
                    }
                })
            } else {
                if (delay !== null) {
                    id = setTimeout(tick, delay)
                }
            }
        }
        if (delay !== null) {
            id = setTimeout(tick, delay)
            return () => id && clearTimeout(id)
        }
    }, [delay])
}

export const ViewForm = () => {
    const { identity } = useGetIdentity()
    const [update] = useUpdate()
    const refresh = useRefresh()
    const { resource, recordId } = useParams()
    const { state: location } = useLocation()
    const { data: record, error } = useGetOne(resource ? resource : "", { id: recordId })
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [numLoads, setNumLoads] = useState(0)
    const [loading, setLoading] = useState(true)
    const [formUrl, setFormUrl] = useState("")

    React.useEffect(() => {
        if (numLoads === 2) {
            refresh()
            setLoading(false)
            setNumLoads(0)
        }
    }, [numLoads])

    // refresh periodically while the form is editable to automatically pick up any status changes caused by the calculator "Approve" button workflow //
    useRecursiveTimeout(() => {
        if (record.status === "In Progress" && resource === "claims") {
            refresh()
        }
    }, 5000) // https://stackoverflow.com/questions/61399283/how-to-refresh-the-react-admin-list-data-every-x-seconds

    useEffect(() => {
        if (record && resource && identity?.idp) {
            if (resource === "applications" && record?.form_submission_id) {
                const idirViewUrl = process.env.REACT_APP_MINISTRY_VIEW_URL + record.form_submission_id
                const bceidViewUrl = process.env.REACT_APP_VIEW_URL + record.form_submission_id
                setFormUrl(identity.idp === "bceid" ? bceidViewUrl : identity.idp === "idir" ? idirViewUrl : "")
            } else if (resource === "claims" && record?.service_provider_form_submission_id && record?.status) {
                const bceidViewUrl = process.env.REACT_APP_VIEW_URL + record.service_provider_form_submission_id
                const draftUrl = `${process.env.REACT_APP_DRAFT_URL}${record.service_provider_form_submission_id}&initialTab=${location?.initialTab}`
                setFormUrl(record.status === "In Progress" ? draftUrl : bceidViewUrl)
            }
        }
    }, [record])

    if (error || !resource || !recordId || !identity) {
        return <span />
    }

    const handleStatusChange = (newStatus) => {
        const diff = { status: newStatus }
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
        <div>
            {(loading || !record || !formUrl) && <Loading sx={{ marginTop: 20 }}></Loading>}
            <Box hidden={loading || !record || !formUrl} style={{ position: "relative", marginTop: 7 }}>
                {!loading && record && formUrl && (
                    <div
                        style={{
                            borderBottom: "solid 2px " + COLOURS.MEDIUMGREY,
                            backgroundColor: "white",
                            width: "100%",
                            height: resource === "applications" && identity?.idp === "idir" ? "8em" : "5em",
                            position: "absolute",
                            zIndex: 1
                        }}
                    >
                        <Box
                            style={{
                                display: "flex",
                                marginTop: resource === "applications" && identity?.idp === "idir" ? "4em" : "1em"
                            }}
                        >
                            <BackButton resource={resource} />
                            <StatusDropdown record={record} resource={resource} onChange={handleStatusChange} />
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
                        &nbsp;
                    </div>
                )}
                {formUrl && (
                    <iframe
                        src={formUrl}
                        ref={iframeRef}
                        style={{ border: "solid 2px " + COLOURS.MEDIUMGREY, width: "100%", height: "55em" }}
                        hidden={loading || !record}
                        onLoad={(e) => {
                            setNumLoads((numLoads) => numLoads + 1)
                        }}
                    />
                )}
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
        </div>
    )
}
