let dataFileList
let dataFileIndex
let data
let fetchingDataFile = false

const fetchDataFileList = () => {
  console.log('Fetching data.json')
  const xhr = new XMLHttpRequest()
  xhr.open('GET', 'data.json')
  xhr.onload = () => {
    if (xhr.status === 200) {
      dataFileList = JSON.parse(xhr.response)
      dataFileIndex = 0
      console.log(`Found ${dataFileList.length} data files`)
      fetchNextDataFile()
    } else {
      alert('Request failed.  Returned status of ' + xhr.status)
    }
  }
  xhr.send()
}

const fetchNextDataFile = () => {
  if (fetchingDataFile || dataFileIndex == undefined || dataFileIndex > dataFileList.length) {
    return
  }

  fetchingDataFile = true

  const nextFile = `data/${dataFileList[dataFileIndex]}`

  console.log(`Fetching file ${dataFileIndex} ${nextFile}`)

  const xhr = new XMLHttpRequest()
  xhr.open('GET', `data/${dataFileList[dataFileIndex]}`)
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
