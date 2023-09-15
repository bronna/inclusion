import { getData } from "../data/processData.js";
import { writable, derived } from 'svelte/store';

let data = getData()

//export const selectedDistricts = writable([4101620, 4100023, 4110040, 4110820, 4111290]);

let initialSelectedDistricts = data
    .filter(district => district.name !== undefined && district.GEOID !== '999999')
    .sort((a, b) => b.students - a.students)
    .slice(0, 5)
    .map(district => district.GEOID);

export const selectedDistricts = writable(initialSelectedDistricts);

export const districtsData = writable(data.slice(1));

export const selectedDistrictsData = derived(
    [selectedDistricts, districtsData],
    ([$selectedDistricts, $districtsData]) => {
        // Create a map for faster lookups
        const districtsDataMap = new Map();
        $districtsData.forEach(district => {
            districtsDataMap.set(district.GEOID, district);
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