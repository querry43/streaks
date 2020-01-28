const fs = require('fs')
const utm = require('utm')
const {isValidLat, isValidLong, filterVehicles} = require('./lib')

const processFiles = (center, range, files) => {
  const dataFiles = []

  files.forEach(file => {
    console.log(`Parsing ${file}`)
    const vehicles = JSON.parse(fs.readFileSync(`data/${file}`))['acList']

    const filteredVehicles = filterVehicles(
      pdx,
      range,
      vehicles
    )

    const data = {
      center: pdx,
      range: range,
      vehicles: filteredVehicles
    }

    const outputFile = `public/data/${file}`
    fs.writeFileSync(outputFile, JSON.stringify(data))
    dataFiles.push(outputFile)
  })

  fs.writeFileSync('public/data.json', JSON.stringify(dataFiles))
}

const dataFiles = fs.readdirSync('./data').filter(f => f.match(/\.json$/))

const range = 200000

const pdx = {
  Lat: 45.5876219,
  Long: -122.5903169,
}

Object.assign(pdx, utm.fromLatLon(pdx.Lat, pdx.Long))

processFiles(pdx, range, dataFiles)
