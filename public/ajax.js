let dataFileList
let dataFileIndex
let data
let fetchingDataFile = false
let dictionary

//const dataDir = 'filtered-data'
const dataDir = 'by-vehicle-data'

const fetch = (file, callback) => {
  console.log(`Fetching ${file}`)
  const xhr = new XMLHttpRequest()
  xhr.open('GET', file)
  xhr.onload = () => {
    if (xhr.status === 200) {
      callback(xhr)
    } else {
      alert('Request failed.  Returned status of ' + xhr.status)
    }
  }
  xhr.send()
}

const fetchDataFileList = () => {
  fetch(`${dataDir}/index.json`, xhr => {
    dataFileList = JSON.parse(xhr.response)
    dataFileIndex = 0
    console.log(`Found ${dataFileList.length} data files`)
    fetchDictionary()
  })
}

const fetchDictionary = () => {
  fetch(`${dataDir}/dictionary.json`, xhr => {
    dictionary = JSON.parse(xhr.response)
    console.log(`Found ${Object.keys(dictionary).length} vehicles`)
    fetchNextDataFile()
  })
}

const fetchNextDataFile = () => {
  if (fetchingDataFile || dataFileIndex == undefined) {
    return
  }

  if (dataFileIndex >= dataFileList.length) {
    dataFileIndex = 0
  }

  fetchingDataFile = true

  const nextFile = `${dataDir}/${dataFileList[dataFileIndex]}`

  console.log(`Fetching file ${dataFileIndex} ${nextFile}`)

  const xhr = new XMLHttpRequest()
  xhr.open('GET', `${dataDir}/${dataFileList[dataFileIndex]}`)
  xhr.onload = () => {
    if (xhr.status === 200) {
      data = JSON.parse(xhr.response)
      console.log(`Found ${data.vehicles.length} vehicles`)
      dataFileIndex++
      fetchingDataFile = false
    } else {
      alert('Request failed.  Returned status of ' + xhr.status)
    }
  }
  xhr.send()
}
