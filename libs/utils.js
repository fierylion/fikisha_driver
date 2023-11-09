// export const sortByDate = (a, b) => {
//  return ()=> new Date(b) - new Date(a);
// };
import { Linking, Alert, Platform } from 'react-native'

export function formatFullDate(dateString) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  const formattedDate = `${day} ${month} ${year}`
  return formattedDate
}
export const callNumber = (phone) => {
  console.log('callNumber ----> ', phone)
  let phoneNumber = phone
  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`
  } else {
    phoneNumber = `tel:${phone}`
  }
  Linking.canOpenURL(phoneNumber)
    .then((supported) => {
      if (!supported) {
        Alert.alert('Phone number is not available')
      } else {
        return Linking.openURL(phoneNumber)
      }
    })
    .catch((err) => console.log(err))
}