const regionalSettings = {
  "gta": {
    "center": {
      lat: 43.741667,
      lon: -79.373333
    },
    "zoom": 12,
    "dataFile": "schools_gta.json",
    "schoolBoards": [
      { label: 'Toronto DSB', checked: true, value: 'TDSB' },
      { label: 'York Region DSB', checked: false, value: 'YRDSB' },
      { label: 'Peel DSB', checked: false, value: 'PDSB' },
      { label: 'Durham DSB', checked: false, value: 'DDSB' },
      { label: 'Halton DSB', checked: false, value: 'HDSB' },
      { label: 'Upper Grand DSB', checked: false, value: 'UGDSB' },
      { label: 'Hamilton-W. DSB', checked: false, value: 'HWDSB' },
      { label: 'Waterloo R. DSB', checked: false, value: 'WRDSB' }
    ]
  },
  "van": {
    // "center": {
    //   lat: 49.2827,
    //   lon: -123.1207
    // },
    "center": {
      lat: 49.25,
      lon: -123.0
    },
    "zoom": 11.5,
    "dataFile": "schools_van.json",
    "schoolBoards": [
      { label: 'Vancouver SB', checked: true, value: 'VSB' },
      { label: 'North Van SD', checked: true, value: 'NVSD' },
      { label: 'West Van SD', checked: true, value: 'WVSD' },
      { label: 'Burnaby SD', checked: true, value: 'BSD' },
      { label: 'Richmond SD', checked: true, value: 'RSD' },
      { label: 'New West. SD', checked: true, value: 'NWSD' },
      { label: 'Surrey SD', checked: true, value: 'SSD' },
      { label: 'Coquitlam SD', checked: true, value: 'CSD' }
    ]
  }
}

export default regionalSettings