import { error } from '@sveltejs/kit'
import { getData } from "../../data/processData.js"

let data = getData()

export function load({ params }) {
    const districtData = data.find((d) => d.properties.GEOID === params.districtID)
    const stateData = data.find((d) => d.properties.GEOID === "999999")

    if (!districtData) throw error(404)

    return {
        districtData,
        stateData
    }
}

