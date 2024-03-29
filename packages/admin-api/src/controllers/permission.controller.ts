/* eslint-disable import/prefer-default-export */
import * as express from "express"
import * as permissionService from "../services/permission.service"

export const getPermission = async (req: any, res: express.Response) => {
    try {
        let guid
        let isIDIR = false
        if (
            req.kauth.grant.access_token.content.identity_provider === "bceid" ||
            req.kauth.grant.access_token.content.identity_provider === "bceidboth"
        ) {
            guid = req.kauth.grant.access_token.content.bceid_user_guid
        } else if (req.kauth.grant.access_token.content.identity_provider === "idir") {
            guid = req.kauth.grant.access_token.content.idir_user_guid
            isIDIR = true
        }
        if (!guid) {
            return res.status(403).send("Access denied")
        }
        const permissionResponse = await permissionService.getPermission(guid, isIDIR)
        if (!permissionResponse) {
            return res.status(500).send("Server Error")
        }
        permissionResponse.filter(
            (item: any) =>
                // Only support catchments 1 - 45.
                item.Application === "WGS" && Number(item.Catchment) > 100 && Number(item.Catchment) < 146
        )
        return res.status(200).send({
            permissions: permissionResponse,
            access: permissionResponse.length > 0,
            provider: isIDIR ? "IDIR" : "BCEID"
        })
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
