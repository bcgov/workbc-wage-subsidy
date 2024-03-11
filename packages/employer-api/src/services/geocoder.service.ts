/* eslint-disable import/prefer-default-export */

import axios from "axios"
import { getCatchment } from "../utils/addressToCatchment"

/**
 * @param address Address line 1
 * @param city city
 * @param province one of the provinces in Canada
 * @return object {score, fullAddress}
 */
export const geocodeAddress = async (address: string, city: string, province: string) => {
    // get call to https://geocoder.api.gov.bc.ca/addresses.geojson?addressString={address},{city},{string}
    // return score from features[0].properties.score
    // and fullAddress from features[0].properties.fullAddress
    let Score = null
    let FullAddress = null
    let Catchment = null
    let Storefront = null
    await axios
        .post(`http://geocoder.api.gov.bc.ca/addresses.geojson?addressString=${address},${city},${province}`)
        .then((response) => {
            const { score } = response.data.features[0].properties
            const catchment = getCatchment(
                response.data.features[0].geometry.coordinates[1],
                response.data.features[0].geometry.coordinates[0]
            )
            Catchment = catchment.closestCatchment
            Storefront = catchment.closestStorefrontId
            Score = score
            FullAddress = {
                address: `${response.data.features[0].properties.fullAddress.split(",")[0]}`,
                city: response.data.features[0].properties.localityName,
                province: response.data.features[0].properties.provinceCode
            }
        })
    return { Score, FullAddress, Catchment, Storefront }
}
