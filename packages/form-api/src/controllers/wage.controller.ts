/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as wageService from "../services/wage.service"

export const insertWage = async (req: any, res: express.Response) => {
    try {
        const { data } = req.body
        const { user } = req.body.data.userInfo
        // console.log(data)
        const claims = await wageService.insertWage(data, user)
        return res.status(200).send(claims.data)
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
