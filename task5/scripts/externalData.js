// const fs = require('fs/promises');

// async function getData(data) {
//     try {

        
//         const fileData = await fs.readFile("db/data/employee.db-externalTimeSheet.csv", "utf-8");

//         const headers = fileData.split("\n")[0]; 
         
//         // console.log(headers)
     
//         const rows = data.map((obj) => {
//             return Object.values(obj??'').join(",");
//         });
    

//         // console.log(rows)
//         const csvContent = [headers, ...rows].join("\n");
//         //  console.log(csvContent)

//         await fs.writeFile("db/data/employee.db-externalTimeSheet.csv", csvContent, "utf-8");

//         console.log("CSV file updated successfully");

//     } catch (error) {
//         console.error("Error:", error);
//     }
// }

// // Example data
// // const data = [
// //   { ID: 1, NAME: "Alice", CITY: "New York" },
// //   { ID: 2, NAME: "Bob", CITY: "London" },
// //   { ID: 3, NAME: "Charlie", CITY: "Sydney" }
// // ];

// // getData(data);

// module.exports = getData;