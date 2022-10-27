/* eslint-disable import/prefer-default-export */

import axios from "axios"

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
    await axios.get("")
    return null
}
