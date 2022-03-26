const express = require("express");
const fs = require("fs");
const readline = require("readline");
const angleCalc = require("astronomy-bundle/utils/angleCalc.js");
const createTimeOfInterest = require("astronomy-bundle/time/createTimeOfInterest.js");
const sunFunctions = require("astronomy-bundle/sun");
const starFunctions = require("astronomy-bundle/stars");

const app = express();

let allStars = [];

async function processLineByLine() {
  const fileStream = fs.createReadStream("starList.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    let lineList = line.split("|");
    let newStar = {};
    newStar["name"] = lineList[1].trim();
    newStar["ra"] = lineList[2].trim();
    newStar["dec"] = lineList[3].trim();
    newStar["ra_prop"] = lineList[4].trim();
    newStar["dec_prop"] = lineList[5].trim();
    newStar["vmag"] = lineList[6].trim();
    newStar["spect_type"] = lineList[7].trim();
    newStar["notes"] = lineList[8].trim();
    newStar["class"] = lineList[9].trim();
    allStars.push(newStar);
  }

  console.log(allStars);
  JSON.stringify(allStars);
}

processLineByLine();

app.get("/", (req, res) => {
  res.json(allStars);
});

const location = {
  lat: 42.3736,
  lon: -71.110558,
};

const toi = createTimeOfInterest.fromCurrentTime();
const sun = sunFunctions.createSun(toi);

// //times are in UTC
// const toiRiseCenter = new Promise((resolve, reject) => {
//   resolve(sun.getRise(location));
// }).then((val) => console.log(val, "sunrise"));

// const geoEclCoords = new Promise((resolve, reject) => {
//   resolve(sun.getGeocentricEclipticSphericalDateCoordinates());
// }).then((val) => console.log(val));

// const geoAppEquCoords = new Promise((resolve, reject) => {
//   resolve(sun.getApparentGeocentricEquatorialSphericalCoordinates());
// }).then((val) => {
//   console.log(angleCalc.deg2time(val.rightAscension));
//   console.log(angleCalc.deg2time(val.declination));
// });

const sirius = {
  rightAscension: 101.28715533333333,
  declination: 16.71611586111111,
  radiusVector: 1,
};

const properMotion = {
  rightAscension: -0.0385,
  declination: -1.205,
};

const star = starFunctions.createStar.byEquatorialCoordinates(
  sirius,
  toi,
  properMotion
);

const coords = new Promise((resolve, reject) => {
  resolve(star.getApparentGeocentricEquatorialSphericalCoordinates());
}).then((starCoords) => {
  console.log(checkIfStarinSky(location, starCoords.declination));
  console.log(starCoords);
});

const timeStr = "06h 45m 08.91728s";
const angleInDeg = angleCalc.time2deg(timeStr);
console.log(angleInDeg);

const angleStr = `−16°, 42', 58.0171"`;
const help = angleCalc.angle2deg(angleStr);
console.log(help);

function checkIfStarinSky(location, declination) {
  if (location.lat - declination < 90) {
    return true;
  } else return false;
}

// console.log(checkIfStarinSky(location, -20.3845));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
