/* eslint-disable import/prefer-default-export */

import pins from "../constants/centres.json"
import { calcDistance } from "./distance"

export function getCatchment(lat: any, lon: any) {
    let min = 99999
    let closestStorefrontId
    let closestCatchment
    for (let i = 0; i < pins.length; i += 1) {
        for (let j = 0; j < pins[i].Storefronts.length; j += 1) {
            const distance = calcDistance(
                lat,
                lon,
                pins[i].Storefronts[j].Coordinates.split(",")[0],
                pins[i].Storefronts[j].Coordinates.split(",")[1],
                "K"
            )
            if (distance < min) {
                min = distance
                closestStorefrontId = j + 1
                closestCatchment = i + 1
            }
        }
    }
    return { closestStorefrontId, closestCatchment }
}
