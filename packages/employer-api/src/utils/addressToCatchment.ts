/* eslint-disable import/prefer-default-export */

import pins from "../constants/centres.json"
import { calcDistance } from "./distance"

// Returns the closest centre //
export function getCatchment(lat: any, lon: any) {
    let min = 99999
    let closestStorefrontId
    let closestCatchment
    for (let i = 0; i < pins.length; i += 1) {
        for (let j = 0; j < pins[i].Storefronts.length; j += 1) {
            const distance = calcDistance(
                lat,
                lon,
                pins[i].Storefronts[j].Coordinates.split(",")[1],
                pins[i].Storefronts[j].Coordinates.split(",")[0],
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

// Same idea as getCatchment except we return the n closest centres //
export function getClosestCentres(lat: any, lon: any, n: number) {
    let closestCentres = Array(n).fill({ distance: 99999, storefront: null, catchment: null, name: null }) // array will always be sorted by distance ([0] will be the closest)
    for (let i = 0; i < pins.length; i += 1) {
        for (let j = 0; j < pins[i].Storefronts.length; j += 1) {
            const distance = calcDistance(
                lat,
                lon,
                pins[i].Storefronts[j].Coordinates.split(",")[1],
                pins[i].Storefronts[j].Coordinates.split(",")[0],
                "K"
            )

            if (distance < closestCentres[n - 1].distance) {
                // if it's closer than the farthest recorded centre, then we're safe to drop that one off and insert the new one. No need to worry about placement; sorting will take care of that
                closestCentres.splice(-1, 1, {
                    distance: distance,
                    storefront: j + 1,
                    catchment: i + 1,
                    name: pins[i].Storefronts[j].name
                })
                closestCentres.sort((a, b) => a.distance - b.distance)
            }
        }
    }
    return closestCentres
}

export function getAllCentres() {
    let allCentres = []
    for (let i = 0; i < pins.length; i += 1) {
        for (let j = 0; j < pins[i].Storefronts.length; j += 1) {
            allCentres.push({ name: pins[i].Storefronts[j].name, storefront: j + 1, catchment: i + 1 })
        }
    }
    return allCentres
}
