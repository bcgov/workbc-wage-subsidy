import {pins} from '../../../constants/pins'
import {calcDistance} from '../../../utils/distance'

export function getCatchment(lat, lon) {
    let min = 99999
    let closestIndex
    for (const [index, value] of pins.features.entries()) {
        let distance = calcDistance(lat, lon, value.geometry.coordinates[1], value.geometry.coordinates[0], 'K')
        if (distance < min) {
            min = distance
            closestIndex = index
        }    
    }
    return pins.features[closestIndex].properties.catchmentId
}
