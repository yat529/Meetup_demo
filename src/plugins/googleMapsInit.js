/* eslint-disable */
import Vue from 'vue'

const initMap = {
  install (Vue, config) {
    console.log('here')
    if (!document) return

    let ext,
        apiKey = config.key,
        libraries = config.libraries,
        language = 'en-US'
  
    if (!apiKey) return
    if (!libraries) {
      ext = ''
    } else {
      ext = `&libraries=${libraries}`
    }

    let script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?language=${language}&key=${ apiKey + ext }`
    script.type = 'text/javascript'
    document.body.appendChild(script)
  }
}


export default initMap