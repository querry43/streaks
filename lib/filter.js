const fs = require('fs')
const path = require('path')
const utm = require('utm')
const {extractVehicleMetadata, filterVehicles} = require('./tools')

const filterFilesByLocation = (center, range, outputDir, files) => {
  Object.assign(center, utm.fromLatLon(center.Lat, center.Long))
  const dataFiles = []
  const dictionary = {}

  files.forEach(file => {
    const outputFile = `${outputDir}/${path.basename(file)}`
    console.log(`Filtering ${file} to ${outputFile}`)
    try {
      const vehicles = JSON.parse(fs.readFileSync(file))['acList']

      const filteredVehicles = filterVehicles(
        center,
        range,
        vehicles
      )

      const data = {
        center,
        range,
        boundingBox: {
          minEasting: center.easting - range,
          maxEasting: center.easting + range,
          minNorthing: center.northing - range,
          maxNorthing: center.northing + range
        },
        vehicles: filteredVehicles
      }

      fs.writeFileSync(outputFile, JSON.stringify(data))

      dataFiles.push(path.basename(file))

      vehicles.forEach(v => {
        if (!dictionary[v.Icao]) {
          dictionary[v.Icao] = extractVehicleMetadata(v)
        }
      })

    } catch (e) {
      console.log(`Failed reading ${e}`)
    }
  })

  const indexFile = `${outputDir}/index.json`
  console.log(`Writing index to ${indexFile}`)
  fs.writeFileSync(indexFile, JSON.stringify(dataFiles))

  const dictionaryFile = `${outputDir}/dictionary.json`
  console.log(`Writing dictionary to ${dictionaryFile}`)
  fs.writeFileSync(dictionaryFile, JSON.stringify(dictionary))

  return {
    indexFile: indexFile,
    dictionaryFile: dictionaryFile
  }
}

const groupByVehicle = ({indexFile, dictionaryFile}) => {
  console.log(indexFile)
  console.log(dictionaryFile)
}

module.exports = {
  filterFilesByLocation: filterFilesByLocation,
  groupByVehicle: groupByVehicle
}