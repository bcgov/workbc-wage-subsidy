import { useEffect } from "react"
import { useAuthProvider, useDataProvider } from "react-admin"

const NotificationCheck = () => {
    const dataProvider = useDataProvider()
    const authProvider = useAuthProvider()

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
                await dataProvider.checkNotifcation()
            }
        }
        check()
    }, [])

    return <></>
}

export default NotificationCheck
