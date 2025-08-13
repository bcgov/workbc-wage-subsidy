/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as geocoderService from "../services/geocoder.service"

export const getAddressValidation = async (req: express.Request, res: express.Response) => {
    try {
        const { address, city, province } = req.body
        console.log("validating address: ", address, city, province)
        const addressValidation = await geocoderService.geocodeAddress(address, city, province)
        return res.status(200).send(addressValidation)
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
export const getNearestCentres = async (req: express.Request, res: express.Response) => {
    try {
        const { address, city, province } = req.body
        console.log("getting nearest centres for: ", address, city, province)
        const closestCentres = await geocoderService.calculateNearestCentres(address, city, province, 3)
        return res.status(200).send(closestCentres)
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
