const fs = require('fs')
const {filterFilesByLocation, groupByVehicle} = require('./lib')

const rawDataDir = './raw-data'
const filteredDataDir = './filtered-data'
const byVehicleDataDir = './by-vehicle-data'

const dataFiles = fs.readdirSync(rawDataDir)
  .filter(f => f.match(/\.json$/))
  .map(f => `${rawDataDir}/${f}`)

const pdx = {
  Lat: 45.5876219,
  Long: -122.5903169,
}

const range = 200000 // meters

const filteredData = filterFilesByLocation(
  pdx,
  range,
  filteredDataDir,
  dataFiles
)

// testing
// const filteredData = {
//   indexFile: 'filtered-data/index.json',
//   dictionaryFile: 'filtered-data/dictionary.json'
// }

groupByVehicle(filteredData, byVehicleDataDir)
