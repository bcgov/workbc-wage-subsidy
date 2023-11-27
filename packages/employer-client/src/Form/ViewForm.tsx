/* eslint-disable jsx-a11y/iframe-has-title */
import { useEffect, useState } from "react"
import { Box, Button, Tooltip } from "@mui/material"
import { useParams } from "react-router"
import { COLOURS } from "../Colours"
import BackButton from "../common/components/BackButton/BackButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpRightFromSquare } from "@fortawesome/pro-solid-svg-icons"
import { Loading, useDataProvider, useGetOne, useRefresh } from "react-admin"

export const ViewForm = () => {
    const { resource, recordId } = useParams()
    const [numLoads, setNumLoads] = useState(0)
    const [loading, setLoading] = useState(true)
    const refresh = useRefresh()
    const { data: record, error } = useGetOne(resource ? resource : "", { id: recordId })
    const dataProvider = useDataProvider()
    const [stale, setStale] = useState(false)

    const markAsStale = () => {
        if (record?.id) {
            dataProvider.mark(resource, { id: record.id })
        }
    }

    useEffect(() => {
        if (record && record.status === "Draft" && !stale) {
            markAsStale()
            setStale(true)
        }
    }, [record])

    useEffect(() => {
        if (numLoads === 2) {
            refresh()
            setLoading(false)
            setNumLoads(0)
        }
    }, [numLoads])

    if (!resource || !recordId || !record || !record?.form_submission_id) {
        return <span />
    }

    let formUrl
    if (record.status !== "Draft") formUrl = process.env.REACT_APP_VIEW_URL + record.form_submission_id
    if (record.status === "Draft") formUrl = process.env.REACT_APP_DRAFT_URL + record.form_submission_id

    return (
        <div>
            {loading && <Loading sx={{ marginTop: 20 }}></Loading>}
            <Box hidden={loading} style={{ position: "relative", marginTop: 7 }}>
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
                    onLoad={(e) => {
                        setNumLoads((numLoads) => numLoads + 1)
                    }}
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
        </div>
    )
}
