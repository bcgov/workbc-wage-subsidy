/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as claimService from "../services/claim.service"

export const insertClaim = async (req: any, res: express.Response) => {
    try {
        const { data } = req.body
        const user = req.body.data.userInfo
        // console.log(data)
        const claims = await claimService.insertClaim(data, user)
        // console.log(claims)
        return res.status(200).send(claims)
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
