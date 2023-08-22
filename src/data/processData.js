import originalData from "./OregonData.js"

export const getData = () => {
    let data = JSON.parse(JSON.stringify(originalData));
    
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
    });


    let summary = {
      name: "Oregon",
      GEOID: "999999",
      students: totalStudents,
      eighty: eighty / totalStudents,
      forty: forty / totalStudents,
      separate: separate / totalStudents,
      between: between / totalStudents,
    }

    data.push(summary)

    return data.sort((a, b) => {
      if (!a.name && !b.name) return 0;  // If both are missing, they're equal
      if (!a.name) return 1;  // If only a's name is missing, a is greater
      if (!b.name) return -1; // If only b's name is missing, b is greater
      return a.name.localeCompare(b.name); // If neither is missing, do the actual comparison
    });
  };