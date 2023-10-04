import { getData } from "../data/processData.js";
import { writable, derived } from 'svelte/store';

let data = getData()
console.log(data)

let initialSelectedDistricts = data
    .filter(district => district.properties["Total Student Count"] !== undefined && district.properties.GEOID !== '999999')
    .sort((a, b) => b.properties["Total Student Count"] - a.properties["Total Student Count"])
    .slice(0, 5)
    .map(district => district.properties.GEOID);

export const selectedDistricts = writable(initialSelectedDistricts);

export const districtsData = writable(data);

export const selectedDistrictsData = derived(
    [selectedDistricts, districtsData],
    ([$selectedDistricts, $districtsData]) => {
        // Create a map for faster lookups
        const districtsDataMap = new Map();
        $districtsData.forEach(district => {
            districtsDataMap.set(district.properties.GEOID, district);
        });

        const result = [];
        $selectedDistricts.forEach(GEOID => {
            const districtData = districtsDataMap.get(GEOID);
            if (!districtData) {
                console.error(`No data found for district with GEOID: ${GEOID}`);
            } else {
                result.push(districtData);
            }
        });

        return result;
    }
);

// Calculate the min and max weighted inclusion values for districts above 500 students
export const minWeightedInclusion = derived(districtsData, $districtsData => {
    return Math.min(
        ...$districtsData
            .filter(district => district.properties["Total Student Count"] > 500)
            .filter(district => district.properties.weighted_inclusion)
            .map(district => district.properties.weighted_inclusion)
    )
});

export const maxWeightedInclusion = derived(districtsData, $districtsData => {
    return Math.max(
        ...$districtsData
            .filter(district => district.properties["Total Student Count"] > 500)
            .filter(district => district.properties.weighted_inclusion)
            .map(district => district.properties.weighted_inclusion)
    )
})