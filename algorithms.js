
const circleRadius = 2 // in kilometers
// distance between two points haversine formula
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance // in kilometers
}


// important close points function driverClosePoints and sharingReceiverClosePoints

// Driver close points
function driverSingleClosePointsCheck(driverLat, driverLon, sendLat, sendLon) {
  const distance = haversine(driverLat, driverLon, sendLat, sendLon)

  if (distance <= circleRadius) {
    return true
  } else {
    return false
  }
}
 
export { driverSingleClosePointsCheck}
