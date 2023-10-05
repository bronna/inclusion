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
        // console.log(district.properties["Institution Name"], district.properties.weighted_inclusion)

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

    let firstQuartile = minWeightedInclusion + (range * 0.25);
    let secondQuartile = minWeightedInclusion + (range * 0.5);
    let thirdQuartile = minWeightedInclusion + (range * 0.75);

    data.forEach(district => {
        if(!district.properties.weighted_inclusion) {
            district.properties.quartile = null;
        } else if (district.properties.weighted_inclusion < firstQuartile) {
            district.properties.quartile = 1;
        } else if (district.properties.weighted_inclusion < secondQuartile) {
            district.properties.quartile = 2;
        } else if (district.properties.weighted_inclusion < thirdQuartile) {
            district.properties.quartile = 3;
        } else {
            district.properties.quartile = 4; 
        }
    });

    return data
        .filter(district => district.properties["Institution Name"])
        .sort((a, b) => {
            if (!a.properties["Institution Name"] && !b.properties["Institution Name"]) return 0;
            if (!a.properties["Institution Name"]) return 1;
            if (!b.properties["Institution Name"]) return -1;
            return a.properties["Institution Name"].localeCompare(b.properties["Institution Name"]);
        });
};