/* eslint-disable */ 
let Utils = {}

/* 
 * Animation Scroll to target element
 */
Utils.animateScrollTo = ($appBody, $targetElm, duration) => {
  let to = $appBody.scrollHeight - $targetElm.scrollHeight
  scrollTo($appBody, to, duration)

  // return a optional promise if further step to take after animation
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })

  // helper function
  function scrollTo (element, to, duration) {
    let start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 1000/60
        
    let animateScroll = () => {        
          currentTime += increment
          let val = Math.easeInOutQuad(currentTime, start, change, duration)
          element.scrollTop = val
          if(currentTime < duration) {
            window.requestAnimationFrame(() => animateScroll.call(increment))
          }
        }

    animateScroll()
  }
}


/* 
 * Used to find parent element with specific ID
 */
Utils.findParent = (startElem, parentId) => {
  let parentNode = startElem.parentElement,
      parent

  if (parentNode && parentNode.id == parentId) {
    return parentNode
  } else {
    parent = Utils.findParent(parentNode, parentId)
  }

  return parent
}


Utils.encodeUserEmail = (email) => {
  return email.replace('.', ',')
}

Utils.decodeUserEmail = (email) => {
  return email.replace(',', '.')
}

export default Utils



// helper function
Math.easeInOutQuad = (t, b, c, d) => {
  t /= d/2
  if (t < 1) return c/2*t*t + b
  t--
  return -c/2 * (t*(t-2) - 1) + b
}


