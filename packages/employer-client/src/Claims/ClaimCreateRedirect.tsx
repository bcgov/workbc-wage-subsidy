import { useEffect } from "react"
import { useRedirect, useStore } from "react-admin"
import { claimStatusFilters } from "./ClaimList"

export const ClaimCreateRedirect = () => {
    const redirect = useRedirect()
    const [, setStatusFilter] = useStore<any>("resources.claim.list.statusFilter", claimStatusFilters.All)

    useEffect(() => {
        setStatusFilter(claimStatusFilters["All"])
        redirect("create", "claims")
    }, [setStatusFilter, redirect])

    return <span />
}
