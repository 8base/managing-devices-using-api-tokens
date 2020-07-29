const fs = require('fs')

/* Path to storage file */
const file = './src/storage/data.json'

module.exports = {
  /* Get a value from storage */
  get: key => {
    return JSON.parse(fs.readFileSync(file))[key]
  },
  /* Set a value in storage */
  set: obj => {
    console.log('Adding to storage: ', obj)

    const data = JSON.parse(fs.readFileSync(file))

    Object.assign(data, obj)

    fs.writeFileSync(file, JSON.stringify(data))
  }
}
