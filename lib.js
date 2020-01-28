const utm = require('utm')

const isValidLat = lat => lat >= -80 && lat <= 84
const isValidLong = long => long >= -180 && long <= 180

const filterVehicles = (center, range, vehicles) =>
  vehicles
    .filter(v => isValidLat(v.Lat) && isValidLong(v.Long))
    .map(v => Object.assign(v, {utm: utm.fromLatLon(v.Lat, v.Long)}))
    .filter(v =>
      v.utm.zoneNum === center.zoneNum
      && v.utm.northing > center.northing - range
      && v.utm.northing < center.northing + range
      && v.utm.easting > center.easting - range
      && v.utm.easting < center.easting + range
    )

module.exports = {
  filterVehicles: filterVehicles,
  isValidLat: isValidLat,
  isValidLong: isValidLong
}
