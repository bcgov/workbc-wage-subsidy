/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as wageService from "../services/wage.service"

export const insertWage = async (req: any, res: express.Response) => {
    try {
        const { data } = req.body[0]
        const { user } = req.body[1]
        // console.log(data)
        const claims = await wageService.insertWage(data, user)
        // console.log(claims)
        return res.status(200).send(claims.data)
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
