/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"
import * as permissionService from "../services/permission.service"

export const getPermission = async (req: any, res: express.Response) => {
    try {
        const { identity_provider, bceid_user_guid, idir_user_guid } = req.auth
        if (!req.auth) {
            return res.status(401).send("Unauthorized")
        }
        let guid
        let isIDIR = false

        if (identity_provider === "bceid" || identity_provider === "bceidboth") {
            guid = bceid_user_guid
        } else if (identity_provider === "idir") {
            guid = idir_user_guid
            isIDIR = true
        }

        if (!guid) {
            return res.status(403).send("Access denied")
        }

        let permissionResponse = await permissionService.getPermission(guid, isIDIR)
        if (!permissionResponse) {
            return res.status(500).send("Server Error")
        }

        // Only support catchments 1 - 45.
        permissionResponse = permissionResponse.filter(
            (item: any) => item.Application === "WGS" && Number(item.Catchment) > 100 && Number(item.Catchment) < 146
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
