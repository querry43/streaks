const utm = require('utm')

const isValidLat = lat => lat >= -80 && lat <= 84
const isValidLong = long => long >= -180 && long <= 180
const isValidLatLong = (lat, long) => isValidLat(lat) && isValidLong(long)

// not on ground, only broadcast positions
const isTargetVehicle = vehicle => ! vehicle.Mlat && ! vehicle.PosStale && ! vehicle.Gnd

const lookupSpecies = species => ({
  0: 'None',
  1: 'Land Plane',
  2: 'Sea Plane',
  3: 'Amphibian',
  4: 'Helicopter',
  5: 'Gyrocopter',
  6: 'Tiltwing',
  7: 'Ground Vehicle',
  8: 'Tower'
}[species])

const lookupEngineType = engineType => ({
  0: 'None',
  1: 'Piston',
  2: 'Turboprop',
  3: 'Jet',
  4: 'Electric'
}[engineType])

const lookupWakeTurbulanceCategory = wtc => ({
  0: 'None',
  1: 'Light',
  2: 'Medium',
  3: 'Heavy'
}[wtc])

const extractFields = ({ Icao, Lat, Long, PosTime, Spd, Trak }) => (
  {
    Icao,
    PosTime,
    Spd,
    Trak,
    Position: {
      Lat,
      Long,
      ...utm.fromLatLon(Lat, Long),
    }
  }
)

const filterPosition = (vehicle, center, range) => 
  vehicle.Position.zoneNum === center.zoneNum
  && vehicle.Position.northing > center.northing - range
  && vehicle.Position.northing < center.northing + range
  && vehicle.Position.easting > center.easting - range
  && vehicle.Position.easting < center.easting + range

const filterVehicles = (center, range, vehicles) =>
  vehicles
    .filter(v => isTargetVehicle(v))
    .filter(v => isValidLatLong(v.Lat, v.Long))
    .map(v => extractFields(v))
    .filter(v => filterPosition(v, center, range))

const extractVehicleMetadata = ({ Cnum, Cou, EngMount, EngType, Engines, Fseen, Icao, Man, Mdl, Mil, Op, OpIcao, Reg, Species, Type, WTC, Year }) => (
  {
    Cnum,
    Cou,
    EngMount,
    EngType,
    EngTypeName: lookupEngineType(EngType),
    Engines,
    Fseen,
    Icao,
    Man,
    Mdl,
    Mil,
    Op,
    OpIcao,
    Reg,
    Species,
    SpeciesName: lookupSpecies(Species),
    Type,
    WTC,
    WTCName: lookupWakeTurbulanceCategory(WTC),
    Year
  }
)

module.exports = {
  extractVehicleMetadata: extractVehicleMetadata,
  filterVehicles: filterVehicles
}
