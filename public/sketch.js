fetchDataFileList()

const height = 800
const width = 800
const fps = 5

function setup() {
  createCanvas(width, height)
  frameRate(fps)
}

const vehicleColors = {}

function draw() {
  background(51)

  if (data != undefined) {
    const minEasting = data.center.easting - data.range
    const maxEasting = data.center.easting + data.range
    const minNorthing = data.center.northing - data.range
    const maxNorthing = data.center.northing + data.range

    console.log(`Vehicles: ${data.vehicles.length}`)

    strokeWeight(10)

    data.vehicles.forEach(v => {
      if (!vehicleColors[v.Icao]) {
        vehicleColors[v.Icao] = color(random(255), random(255), random(255))
      }

      stroke(vehicleColors[v.Icao])

      point(
        map(v.utm.easting, minEasting, maxEasting, 0, width),
        map(v.utm.northing, maxNorthing, minNorthing, 0, height) // inverted
      )
    })

    fetchNextDataFile()
  }
}
