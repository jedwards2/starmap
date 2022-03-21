const express = require("express");
const angleCalc = require("astronomy-bundle/utils/angleCalc.js");
const createTimeOfInterest = require("astronomy-bundle/time/createTimeOfInterest.js");
const sunFunctions = require("astronomy-bundle/sun");
const createStar = require("astronomy-bundle/stars");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

const location = {
  lat: 42.3736,
  lon: -71.110558,
};

const toi = createTimeOfInterest.fromCurrentTime();
const sun = sunFunctions.createSun(toi);

//times are in UTC
const toiRiseCenter = new Promise((resolve, reject) => {
  resolve(sun.getRise(location));
}).then((val) => console.log(val));

const geoEclCoords = new Promise((resolve, reject) => {
  resolve(sun.getGeocentricEclipticSphericalDateCoordinates());
}).then((val) => console.log(val));

const geoAppEquCoords = new Promise((resolve, reject) => {
  resolve(sun.getApparentGeocentricEquatorialSphericalCoordinates());
}).then((val) => {
  console.log(angleCalc.deg2time(val.rightAscension));
  console.log(angleCalc.deg2time(val.declination));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
