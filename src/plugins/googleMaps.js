/* eslint-disable */
// import Vue from 'vue'
console.log('buging')

// map class
function Map (element, option, input = null, cb = null) {
  this._map = null
  this.marker = null
  this.location = null
  this.toDB = null

  // cache data
  this.markers = []

  this.init(element, option, input, cb)
}

Map.prototype.init = function (element, option, input = null, cb = null) {
  let gmapOption = {},
      styles,
      that = this

  // get HTML5 geolocation
  that._geolocate()

  // copy option
  if (option) {
    Object.keys(option).forEach(key => {
      gmapOption[key] = option[key]
    })
  }
  
  // dafualt location if still null
  gmapOption.center = that.location || {
    lat: 40.73,
    lng: -74.00
  }

  // apply styles
  styles = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ]
  gmapOption.styles = styles
  
  // init map
  that._map = new google.maps.Map(element, gmapOption)
  // listen for input address change
  if (input && cb) {
    that._autocomplete(input, cb)
  }
}

Map.prototype._geolocate = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition( position => {
      this.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    })
  }
}

Map.prototype._autocomplete = function (input, cb) {
  let that = this
  let searchBox = new google.maps.places.SearchBox(input)

  searchBox.addListener('places_changed', () => {
    let places = searchBox.getPlaces()
    if (!places.length) return

    places.forEach(place => {
      if (!place.geometry) {
        console.log('Returned place contains no geometry');
        return;
      }

      // save & location
      that.address = place.formatted_address
      that.location = place.geometry.location
      that.locate()

      // save to toDB
      that.toDB = {
        address: that.address,
        LatLng: {
          lat: that.location.lat(),
          lng: that.location.lng()
        }
      }
    })

    // run callback
    if (cb) {
      cb(that.toDB)
    }
  })
}

Map.prototype.locate = function (option) {
  // clear cache
  if (this.marker) {
    this.marker.setMap(null)
    this.marker = null
  }

  let opt = option || {
    position: this.location
  }
  opt.map = this._map

  // add marker and re-position
  this.marker = new google.maps.Marker(opt)
  this._map.setCenter(opt.position)
}

Map.prototype.addMarkerOverlay = function (option, html) {
  let opt = option || {
    position: this.location
  }
  opt.map = this._map

  let marker = new google.maps.Marker(opt)
  let overlay = new Overlay(marker, html)

  marker.addListener('click', function() {
    overlay.open(opt.map)
  })

  this.markers.push(marker)
}

// Overlay Class
function Overlay (marker, html) {
  this.layer = null
  this.container = document.createElement('div')
  // cache data
  this.marker = marker
  this.html = html
}

Overlay.prototype = new google.maps.OverlayView()

Overlay.prototype.onAdd = function() {
  this.layer = this.getPanes().floatPane
  let closeBtn = document.createElement('div')
  closeBtn.setAttribute('class', 'close')
  this.container.innerHTML = this.html
  this.container.firstElementChild.appendChild(closeBtn)
  this.layer.appendChild(this.container)

  // close btn listener
  let that = this
  closeBtn.addEventListener('click', () => {
    that.close()
  })
}

Overlay.prototype.onRemove = function () {
  this.layer.removeChild(this.container)
}

Overlay.prototype.draw = function () {
  let markerPos = this.marker.getPosition()
  let ovrlyPos = this.getProjection().fromLatLngToDivPixel(markerPos)

  this.layer.style.top = ovrlyPos.y + 'px'
  this.layer.style.left = ovrlyPos.x + 'px'
}

Overlay.prototype.open = function (map) {
  this.setMap(map)
}

Overlay.prototype.close = function () {
  this.setMap(null)
}

// const initMap = {
//   install (Vue, config) {
//     if (!document) return

//     let ext
//     let apiKey = config.key
//     let libraries = config.libraries
  
//     if (!apiKey) return
//     if (!libraries) {
//       ext = ''
//     } else {
//       ext = `&libraries=${libraries}`
//     }
    
//     let script = document.createElement('script')
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${ apiKey + ext }`
//     script.type = 'text/javascript'
//     document.body.appendChild(script)
//   }
// }

export {Map, Overlay}