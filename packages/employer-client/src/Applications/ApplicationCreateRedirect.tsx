import { useEffect } from "react"
import { useRedirect, useStore } from "react-admin"
import { applicationStatusFilters } from "./ApplicationList"

export const ApplicationCreateRedirect = () => {
    const redirect = useRedirect()
    const [, setStatusFilter] = useStore<any>("resources.applications.list.statusFilter", applicationStatusFilters.All)

    useEffect(() => {
        setStatusFilter(applicationStatusFilters["All"])
        redirect("create", "wage")
    }, [setStatusFilter, redirect])

    return <span />
}
