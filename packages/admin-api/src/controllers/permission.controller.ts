/* eslint-disable import/prefer-default-export */
import * as express from "express"
import * as permissionService from "../services/permission.service"

export const getPermission = async (req: any, res: express.Response) => {
    try {
        let guid
        if (req.kauth.grant.access_token.content.bceid_user_guid) {
            guid = req.kauth.grant.access_token.content.bceid_user_guid
        }
        if (req.kauth.grant.access_token.content.idir_user_guid) {
            guid = req.kauth.grant.access_token.content.idir_user_guid
        }
        if (!guid) {
            return res.status(403).send("Access denied")
        }
        const permission = await permissionService.getPermission(guid)
        return res.status(200).send(permission)
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
