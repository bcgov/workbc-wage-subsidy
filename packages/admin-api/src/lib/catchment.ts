/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import * as permissionService from "../services/permission.service"

export const getCatchments = async (access_token: any) => {
    try {
        const { bceid_user_guid, idir_user_guid } = access_token.content
        const user_guid = bceid_user_guid || idir_user_guid
        if (user_guid === undefined) {
            return []
        }
        const permission = await permissionService.getPermission(user_guid, false)
        return permission
            .map((item: any) => (item.Catchment !== "N/A" ? Number(item.Catchment.slice(1)) : null))
            .filter((item: any) => item !== null)
    } catch (e: unknown) {
        return []
    }
}
