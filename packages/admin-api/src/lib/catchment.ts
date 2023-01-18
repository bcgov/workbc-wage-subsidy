/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import * as permissionService from "../services/permission.service"
/*  this function basically checks the user's access token 
and then return a list of catchments they have access to
If they do not have access to any catchments we throw an error 
If they are usingg idir and have access to WGS we make it so they can query all catchments */
export const getCatchment = async (access_token: any) => {
    let guid
    let catchment
    if (access_token.content.bceid_user_guid) {
        guid = access_token.content.bceid_user_guid
        const permission = await permissionService.getPermission(guid)
        // fo through the permission array and extract the catchment field to another array for returning
        catchment = permission
            .map((item: any) => (item.Catchment !== "N/A" ? item.Catchment.slice(1) : null))
            .filter((item: any) => item !== null)
    } else if (access_token.content.idir_user_guid) {
        // if user is using idir, and the catchment return list is not empty, then we can return all claims
        guid = access_token.content.idir_user_guid
        catchment = await permissionService.getPermission(guid).then((response: any) => {
            response
                .map((item: any) => (item.Catchment !== "N/A" ? item.Catchment.slice(1) : null))
                .filter((item: any) => item !== null)
            if (response.length > 0) {
                return ["*"]
            }
            return null
        })
    }
    if (!guid || !catchment) {
        throw new Error("Access denied")
    }
    return catchment
}
