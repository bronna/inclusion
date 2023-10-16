import * as topojson from "topojson-client"
import OregonData from "./oregon_data.json"

export const getData = () => {
    const objectName = "OR_SDs_merged";
    const geojsonData = topojson.feature(OregonData, OregonData.objects[objectName])
    let data = geojsonData.features

    let totalStudents = 0;
    let numInclusive = 0;
    let numSemiInclusive = 0;
    let numNonInclusive = 0;
    let numSeparate = 0;

    function weightedInclusion(district) {
        return (
            (
                ( (district["LRE Students >80%"] / 100) * district["Total Student Count"] ) * 0.9
                + ( (district["LRE Students >40% <80%"] / 100) * district["Total Student Count"] ) * 0.6
                + ( (district["LRE Students <40%"] / 100) * district["Total Student Count"] ) * 0.2
                - ( (district["LRE Students Separate Settings"] / 100) * district["Total Student Count"] ) * 0.5
            ) / district["Total Student Count"] * 100
        )
    }

    const alertColumns = [
        "SuspExplFg",
        "SuspExplRaceEthnicityFg",
        "DisPrptnRprsntnFg",
        "DisPrptnRprsntnDsbltyFg"
    ];

    data.forEach(district => {
        if (typeof district.properties["Total Student Count"] === "number" && !isNaN(district.properties["Total Student Count"])) {
            totalStudents += district.properties["Total Student Count"];
        }
        
        if (typeof district.properties["LRE Students >80%"] === "number" && !isNaN(district.properties["LRE Students >80%"])) {
            numInclusive += (district.properties["LRE Students >80%"] / 100) * district.properties["Total Student Count"];
        }
    
        if (typeof district.properties["LRE Students >40% <80%"] === "number" && !isNaN(district.properties["LRE Students >40% <80%"])) {
            numSemiInclusive += (district.properties["LRE Students >40% <80%"] / 100) * district.properties["Total Student Count"];
        }
    
        if (typeof district.properties["LRE Students <40%"] === "number" && !isNaN(district.properties["LRE Students <40%"])) {
            numNonInclusive += (district.properties["LRE Students <40%"] / 100) * district.properties["Total Student Count"];
        }

        if (typeof district.properties["LRE Students Separate Settings"] === "number" && !isNaN(district.properties["LRE Students Separate Settings"])) {
            numSeparate += (district.properties["LRE Students Separate Settings"] / 100) * district.properties["Total Student Count"];
        }

        // Calculate the weighted inclusion
        district.properties.weighted_inclusion = weightedInclusion(district.properties);

        // Tallying up alerts for each district
        let alertsCount = 0;
        alertColumns.forEach(column => {
            if (district.properties[column] === "Yes") {
                alertsCount++;
            }
        });
        district.properties.nAlerts = alertsCount;
    });

    // Creating a new feature for the summary data
    let summaryFeature = {
        //id: 0,
        type: "Feature",
        properties: {
            "Institution Name": "Oregon",
            GEOID: "999999",
            "Total Student Count": totalStudents,
            "LRE Students >80%": (numInclusive / totalStudents) * 100,
            "LRE Students >40% <80%": (numSemiInclusive / totalStudents) * 100,
            "LRE Students <40%": (numNonInclusive / totalStudents) * 100,
            "LRE Students Separate Settings": (numSeparate / totalStudents) * 100
        },
        geometry: null
    };

    data.push(summaryFeature);

    let minWeightedInclusion = Math.min(
        ...data
            .filter(district => district.properties["Total Student Count"] > 500 && district.properties.weighted_inclusion)
            .map(district => district.properties.weighted_inclusion)
    );
    let maxWeightedInclusion = Math.max(
        ...data
            .filter(district => district.properties["Total Student Count"] > 500 && district.properties.weighted_inclusion)
            .map(district => district.properties.weighted_inclusion)
    );
    let range = maxWeightedInclusion - minWeightedInclusion;

    // Define the threshold for each decile
    const thresholds = Array.from({ length: 10 }, (_, i) => minWeightedInclusion + (range * (i + 1) * 0.1));

    data.forEach(district => {
        if (!district.properties.weighted_inclusion) {
            district.properties.decile = null;
        } else {
            for (let i = 0; i < 10; i++) {
                if (district.properties.weighted_inclusion < thresholds[i]) {
                    district.properties.decile = i + 1;
                    break;
                }
            }
        }

        // Assign a value of 10 for the top decile (if not already assigned)
        if (district.properties.weighted_inclusion && !district.properties.decile) {
            district.properties.decile = 10;
        }
    });

    return data
        //.filter(district => district.properties["Institution Name"])
        .sort((a, b) => {
            if (!a.properties["Institution Name"] && !b.properties["Institution Name"]) return 0;
            if (!a.properties["Institution Name"]) return 1;
            if (!b.properties["Institution Name"]) return -1;
            return a.properties["Institution Name"].localeCompare(b.properties["Institution Name"]);
        });
};