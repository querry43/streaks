fetchDataFileList()

const drawMode = {
  LINE: 'line',
  POINT: 'point'
}

const height = 800
const width = 800
const fps = 3
const fade = 30
//const mode = drawMode.POINT
const mode = drawMode.LINE
const maintainVehicleHistory = false

let run = true

const vehicleColors = {}
let vehicleLastLocations = {}

const wtcStrokes = icao => dictionary[icao].WTC * 5

const vehicleColor = icao => {
  if (!vehicleColors[icao]) {
    vehicleColors[icao] = color(random(255), random(255), random(255))
  }

  return vehicleColors[icao]
}

function setup() {
  createCanvas(width, height)
  frameRate(fps)
  background(51)

  // a few interesting blend modes
  //blendMode(BLEND)
  blendMode(LIGHTEST)
  //blendMode(SOFT_LIGHT)
}

function draw() {
  if (data === undefined || !run) {
    return
  }

  background(51, 51, 51, fade)

  data.vehicles.forEach(v => {
    const pos = {
      x: map(v.Position.easting, data.boundingBox.minEasting, data.boundingBox.maxEasting, 0, width),
      y: map(v.Position.northing, data.boundingBox.maxNorthing, data.boundingBox.minNorthing, 0, height) // inverted
    }

    stroke(vehicleColor(v.Icao))
    strokeWeight(wtcStrokes(v.Icao))

    if (mode === drawMode.LINE) {
      if (vehicleLastLocations[v.Icao]) {

        line(
          vehicleLastLocations[v.Icao].x,
          vehicleLastLocations[v.Icao].y,
          pos.x,
          pos.y
        )
      }
    } else if (mode === drawMode.POINT) {
      point(pos.x, pos.y)
    }

    vehicleLastLocations[v.Icao] = pos
  })

  if (!maintainVehicleHistory) {
    vehicleLastLocations = {}
  }

  fetchNextDataFile()
}
