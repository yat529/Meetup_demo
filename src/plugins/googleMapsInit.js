/* eslint-disable */
import Vue from 'vue'

const initMap = {
  install (Vue, config) {
    if (!document) return

    let ext
    let apiKey = config.key
    let libraries = config.libraries
  
    if (!apiKey) return
    if (!libraries) {
      ext = ''
    } else {
      ext = `&libraries=${libraries}`
    }
    
    let script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${ apiKey + ext }`
    script.type = 'text/javascript'
    document.body.appendChild(script)
  }
}


export {initMap}