import { useEffect, useState } from "react"
import { useAuthProvider, useDataProvider, Loading } from "react-admin"

const NotificationCheck = () => {
    const dataProvider = useDataProvider()
    const authProvider = useAuthProvider()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const check = async () => {
            let auth: boolean = false
            await authProvider.checkAuth(undefined).then(() => {
                auth = true
            })
            const permissions = await authProvider.getPermissions(undefined).then((res) => {
                return res
            })
            if (auth !== false && permissions.length !== 0) {
                setLoading(true)
                await dataProvider.checkNotifcation().then(() => setLoading(false))
            }
        }
        check()
    }, [])

    if (loading) {
        return <Loading />
    }

    return <></>
}

export default NotificationCheck
