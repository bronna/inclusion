import data from "../data/OregonData.js";
import { writable, derived } from 'svelte/store';

export const selectedDistricts = writable([4101620, 4100023, 4110040, 4110820, 4111290]);

export const selectedDistrictsData = derived(
    selectedDistricts,
    $selectedDistricts => $selectedDistricts
        .map(GEOID => {
            const districtData = data.find(d => d.GEOID === GEOID);
            if (!districtData) {
                console.error(`No data found for district with GEOID: ${GEOID}`);
                return null;
            }
            return districtData;
        })
        .filter(districtData => districtData !== null)  // remove any null values from the result
);