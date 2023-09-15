import originalData from "./OregonData.js"

export const getData = () => {
    let data = JSON.parse(JSON.stringify(originalData.features));  // Access the features array
    
    let totalStudents = 0
    let eighty = 0
    let forty = 0
    let separate = 0
    let between = 0

    data.forEach((district) => {
        if (typeof district.students === "number" && !isNaN(district.students)) {
            totalStudents += district.students;
        }
        
        if (typeof district.eighty === "number" && !isNaN(district.eighty)) {
            eighty += (district.eighty / 100) * district.students;
        }
    
        if (typeof district.forty === "number" && !isNaN(district.forty)) {
            forty += (district.forty / 100) * district.students;
        }
    
        if (typeof district.separate === "number" && !isNaN(district.separate)) {
            separate += (district.separate / 100) * district.students;
        }
    
        if (typeof district.between === "number" && !isNaN(district.between)) {
            between += (district.between / 100) * district.students;
        }

        district.weighted_inclusion = 
            ( 
                ( (district.eighty / 100) * district.students ) * 0.9
                + ( (district.between / 100) * district.students ) * 0.6
                + ( (district.forty / 100) * district.students ) * 0.2 
            ) / district.students * 100
    });

    // Creating a new feature for the summary data
    let summaryFeature = {
        type: "Feature",
        properties: {
            name: "Oregon",
            GEOID: "999999",
            students: totalStudents,
            eighty: eighty / totalStudents,
            forty: forty / totalStudents,
            separate: separate / totalStudents,
            between: between / totalStudents,
        },
        geometry: null  // Since this is a summary, I'm assuming no specific geometry, but adjust as needed
    };

    data.push(summaryFeature)

    return data.sort((a, b) => {
      if (!a.properties.name && !b.properties.name) return 0;  // If both are missing, they're equal
      if (!a.properties.name) return 1;  // If only a's name is missing, a is greater
      if (!b.properties.name) return -1; // If only b's name is missing, b is greater
      return a.properties.name.localeCompare(b.properties.name); // If neither is missing, do the actual comparison
    });
};
