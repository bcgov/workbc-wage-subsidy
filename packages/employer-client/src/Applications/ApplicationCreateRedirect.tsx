import { useEffect } from "react"
import { useRedirect } from "react-admin"

export const ApplicationCreateRedirect = () => {
    const redirect = useRedirect()

    useEffect(() => {
        redirect("create", "wage")
    }, [redirect])

    return <span />
}
