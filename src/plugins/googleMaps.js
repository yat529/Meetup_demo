/* eslint-disable */

// map class
function Map (element, option, input = null, cb = null) {
  this._map = null
  this.location = null  // {lat, lng}
  this.toDB = null
  this.activeOverlays = []
  
  // cache data
  this.markers = []

  this.init(element, option)
}

Map.prototype.init = function (element, option) {
  let gmapOption = {},
      styles

  if (option) {
    Object.keys(option).forEach(key => {
      gmapOption[key] = option[key]
    })
  }
  
  gmapOption.center = gmapOption.center || {
    lat: 40.73,
    lng: -74.00
  }

  // save to location property
  this.location = gmapOption.center

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
  this._map = new google.maps.Map(element, gmapOption)
}

Map.prototype.geolocate = function (cb) {
  let that = this

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition( position => {
      that.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      that.locate({
        position: that.location
      }, false)

      cb()
    })
  } else {
    console.log('Browser Geolocation disabled.')
  }
  return that
}

Map.prototype.autocomplete = function (input, resultType = null, cb) {
  if (!input) {
    console.log('Input element missing.')
    return this
  }

  if (!resultType) {
    resultType = {
      types: ['(cities)'], 
      componentRestrictions: { country: 'us' }
    }
  }

  let that = this,
      autocomplete = new google.maps.places.Autocomplete(input, resultType)
  
  autocomplete.addListener('place_changed', () => {
    let place = autocomplete.getPlace()

    // save & location
    that.location = getLocation(place)
    that.toDB = getFormatedPlace(place)

    // export place data with callback
    if (cb) {
      cb(that.toDB)
    }
  })

  // helper functions
  function getLocation (place) {
    let location = {}

    if (!place.geometry) return

    location.lat = place.geometry.location.lat()
    location.lng = place.geometry.location.lng()

    return location
  }

  function getFormatedPlace (place) {
    // location details
    let address_details = {},
        addres_formatted = place.formatted_address,
        location = place.geometry.location,
        name = place.name,
        place_id = place.place_id

    // extract info from place if needed
    if (place.address_components) {
      place.address_components.forEach((component, index) => {
        switch (component.types[0]) {
          case 'locality':
            address_details['city'] = component['short_name']
            break
          case 'administrative_area_level_1':
            address_details['state'] = component['short_name']
            break
          case 'country':
            address_details['country'] = component['short_name']
            break
          case 'postal_code':
            address_details['postal_code'] = component['short_name']
            break
        }
      })
    }

    return {
      name: name,
      address: addres_formatted,
      address_details: address_details,
      LatLng: {
        lat: location.lat(),
        lng: location.lng()
      },
      place_id: place_id
    }
  }
}

Map.prototype.locate = function (option = null, showMarker = true) {

  let opt = option || {}
  
  if (!opt.position) {
    opt.position = this.location
  }
  this._map.setCenter(opt.position)

  if (opt.zoom) {
    this._map.setZoom(opt.zoom)
  }

  if (showMarker) {
    // opt.map = this._map
    let marker = new google.maps.Marker({
      map: this._map,
      position: opt.position
    })
  }

  return this
}

Map.prototype.addMarkerOverlay = function (option, html) {
  let that = this,
      opt = option || {
        position: that.location
      }
      opt.map = that._map

  let marker = new google.maps.Marker(opt),
      overlay = new Overlay(marker, html)

  marker.addListener('click', () => {
    if (that.activeOverlays.length) {
      that.activeOverlays.map((activeOverlay, index) => {
        activeOverlay.close()
        that.activeOverlays.splice(index, 1)
      })
    }
    overlay.open(opt.map)
    opt.map.panTo(opt.position)
    that.activeOverlays.push(overlay)
  })

  that.markers.push(marker)
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
  closeBtn.innerHTML = '<i class="fas fa-times-circle"></i>'
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
  this.layer.style.top = (ovrlyPos.y - 206) + 'px'
  this.layer.style.left = (ovrlyPos.x + 30) + 'px'
}

Overlay.prototype.open = function (map) {
  this.setMap(map)
}

Overlay.prototype.close = function () {
  this.setMap(null)
}

export {Map, Overlay}