const pojo = require('./input.json')
var fs = require("fs");


// Restrictions 

// Only 1 main can be chosen
// From 0 to 2 sides, but none can be repeated 
// NONE of the above can be an option 
// There can be MULTIPLE best order costs 
// Attempt last, but Export results into a new JSON file 

// 1. Iterate thru the POJO
// 2. Iterate over Main Dish
//      2a. Find ALL subset combination of Side Dishes
//      2b. Add them up and push into SideSum Array 
// 3. Filter out any combinations that are GREATER than maxTotal 
// 4. Push in the best combination for that Main Dish into Array

function findTheBestMeal(pojo) {
    let finalResult = [];
    let resultJSON = [];

    for (let i = 0; i < pojo.length; i++) {

        let mains = Object.values(pojo[i].mains);
        let sides = Object.values(pojo[i].sides);
        let maxTotal = pojo[i].money
        let tempMain = [];
        let tempSides = [];

        for (let j = 0; j < mains.length; j++) {
            let difference = maxTotal - mains[j]

            if (difference !== 0) {
                let entree = mains[j]
                let subsets = findAllSubsets(sides) // helper function that finds all combination of side dishes
                // let closest = Infinity; 

                for (let k = 0; k < subsets.length; k++) {
                        // Similar to Ruby's .sum() , that just sums up all the values of side dishes up in an array
                        let sideSum = subsets[k].reduce((a, b) => a + b, 0);
                        // console.log("sideSum: " + sideSum)
                        // Now take the side dishes + add to MainDish[i]
                        tempSides.push(entree + sideSum)
                }
            }
        }

        // Remove any possibilities over the MaxTotal
        tempSides = tempSides.filter( (el) => el <= maxTotal);
        // Shovel in the max (closest) total
        tempMain.push(Math.max(...tempSides))

        for (let k = 0; k < tempMain.length; k++) {
            if ( tempMain[k] == -Infinity) {
                tempMain.splice(k, 1, 0);
            }
        } 
        finalResult.push(tempMain);
    }
    resultJSON = JSON.stringify(finalResult);

    fs.writeFile("./final.json", resultJSON, err => {
        if (err) {
        console.error(err);
        return;
        }
        console.log("File has been created");
    });
}

findTheBestMeal(pojo);

function findAllSubsets(arr) {
  if (!arr.length) return [[]];
  const last = arr[arr.length - 1];
  const subs = findAllSubsets(arr.slice(0, arr.length - 1));
  return subs.concat(subs.map((el) => {
    let newArr = el.slice(0);
    newArr.push(last);
    return newArr;
  }));
}

