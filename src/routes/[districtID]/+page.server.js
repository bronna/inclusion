import { error } from '@sveltejs/kit'
import { getData } from "../../data/processData.js"

let data = getData()

export function load({ params }) {
    const district = data.find((d) => d.properties.GEOID === params.districtID)

    if (!district) throw error(404)

    return district
}
