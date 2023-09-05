/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import * as permissionService from "../services/permission.service"

export const getCatchments = async (access_token: any) => {
    try {
        let permission = []
        const { identity_provider, bceid_user_guid, idir_user_guid } = access_token.content
        if (identity_provider === "bceid" && bceid_user_guid) {
            permission = await permissionService.getPermission(bceid_user_guid, false)
        } else if (identity_provider === "idir" && idir_user_guid) {
            permission = await permissionService.getPermission(idir_user_guid, true)
        }
        return permission
            .map((item: any) => (item.Catchment !== "N/A" ? Number(item.Catchment.slice(1)) : null))
            .filter((item: any) => item !== null)
    } catch (e: unknown) {
        return []
    }
}
