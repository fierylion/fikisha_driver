import { View, Text, StatusBar, TouchableOpacity,ScrollView, ActivityIndicator, BackHandler } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Icon from 'react-native-feather'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import InsantSvg from '../assets/images/acceptDeliveries/instant.svg'
import SharingSvg from '../assets/images/acceptDeliveries/sharing.svg'
import VerticalSvg from '../assets/images/acceptDeliveries/vertical.svg'
import DurationSvg from '../assets/images/acceptDeliveries/duration.svg'
import DistanceSvg from '../assets/images/acceptDeliveries/distance.svg'
import { formatDate, formatMoneyWithCommas } from '../formatters'
import { useState } from 'react'
import { useEffect } from 'react'


const AcceptDeliveries = () => {
   

    const navigation = useNavigation()
    const handleBackButton = () => {
      navigation.goBack()
      return true
    }
    const [notification, setNotification] = React.useState(false)

    React.useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButton
      )

      // Remove the listener when the component unmounts
      return () => {
        backHandler.remove()
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
      }
    }, [])
 const [typeClicked, setTypeClicked] = React.useState('instant')
 const clickType = [{}, {}]
 const instantOrders = useSelector(state=>state.order.orders.instant)
  const sharingOrders = useSelector(state=>state.order.orders.sharing)

 console.log(instantOrders, 'accept')


 return (
   <SafeAreaView
     className=' flex-1 bg-custom_white-500 font-sanBold_500'
     keyboardShouldPersistTaps={'handled'}
   >
     {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
     <StatusBar barStyle='dark-content' backgroundColor='#808080' />
     <View className='mt-1 flex flex-row items-center mx-3'>
       <Icon.ArrowLeft
         color={'gray'}
         height={30}
         width={30}
         onPress={() => navigation.goBack()}
       />
       <Text className='mx-auto font-sanBold_500 text-lg'>Accept Orders</Text>
       <Icon.ArrowLeft />
     </View>

     <View className='flex-row mx-3 mt-3 border-b-4 border-b-custom_white-700'>
       <TouchableOpacity
         className={`flex-row w-1/2 justify-center items-center transition-colors rounded-t-lg ${
           typeClicked === 'instant' ? 'bg-custom_white-600' : ''
         }   py-2`}
         onPress={() => {
           setTypeClicked('instant')
         }}
       >
         <InsantSvg className='' width={30} height={35} />
         <Text
           className={`ml-1 text-lg font-sanBold_500 ${
             typeClicked === 'instant' ? '' : 'text-custom_white-700'
           }`}
         >
           Instant
         </Text>
       </TouchableOpacity>

       <TouchableOpacity
         className={`flex-row w-1/2 justify-center items-center rounded-t-lg transition-colors  ${
           typeClicked !== 'instant' ? 'bg-custom_white-600' : ''
         }   py-2`}
         onPress={() => {
           setTypeClicked('sharing')
         }}
       >
         <SharingSvg
           className=' text-custom_white-100'
           stroke={'#000'}
           color={'white'}
           width={30}
           height={35}
         />
         <Text
           className={`ml-1 text-lg font-sanBold_500 ${
             typeClicked !== 'instant' ? '' : 'text-custom_white-600'
           }`}
         >
           Sharing
         </Text>
       </TouchableOpacity>
     </View>
     <ScrollView className='mx-3 '>
       <View className='mt-3'>
         {typeClicked === 'instant'
           ? instantOrders.map((order, index) => {
               console.log(order)
               return <SingleInstantOrder key={index} order={order} />
             })
           : sharingOrders.map((order, index) => {
               return <SingleSharingOrder key={index} />
             })}
       </View>
     </ScrollView>
   </SafeAreaView>
 )
}

const SingleInstantOrder = ({order})=>{
  //  {"category": "Sortables", "fee": 1000, "payment_by": "sender", "payment_means": "instant", "payment_method": "cash", "receiver_id": {"location_id": {"extra": null, "geocode": "Kinondoni ,66W3+Q3M, Dar es Salaam, Tanzania", "latitude": -6.75275763211196, "latitudeDelta": 0.006005423636554319, "longitude": 39.2026343755424, "longitudeDelta": 0.002999715507030487}, "name": "Gui", "phone": "26568"}, "sender_id": {"location_id": {"extra": null, "geocode": "Kinondoni ,66X2+8G Dar es Salaam, Tanzania", "latitude": -6.7516722, "latitudeDelta": 0.003, "longitude": 39.201334, "longitudeDelta": 0.003}, "name": "Dan", "phone": "56767"}, "status": "pending", "user_id": "ae14ad5c-2712-4106-9e8d-6460102ef000"}
  const [time, setTime] = useState('0 mins ago')
  const navigation = useNavigation()
  useEffect(
    ()=>{
      const interval = setInterval(
        () => setTime(formatDate(order.created_at)),
        2000
      )
      return ()=> clearInterval(interval)

    }, []
  )
 
  

  return (
    <View className='my-1 mr-2 bg-custom_white-400 p-1 rounded'>
      <View className='flex flex-row justify-between '>
        <View className='flex flex-row'>
          <Icon.Box color={'#000'} width={30} height={30} />
          <Text className=' my-auto ml-1 capitalize  font-sanBold_500'>
            {order.category}
          </Text>
        </View>
        <TouchableOpacity
          className='p-1 border border-custom_orange-500 rounded px-2'
          onPress={() => navigation.navigate('InstantDetails', { order })}
        >
          <Text>Accept</Text>
        </TouchableOpacity>
      </View>
      <View className='flex flex-row  justify-between mx-1 my-2 '>
        <View className='flex flex-row'>
          <View className='flex-row mt-1 mr-2'>
            {/* <DistanceSvg className='my-auto' width={25} height={35} /> */}
            <View>
              <Text className='text-xs font-sanBold_700 '>Distance</Text>
              <Text className='text-sm font-sanBold_700 text-custom_orange-500 opacity-75'>
                {order.distance}
              </Text>
            </View>
          </View>
          <View className='flex-row mt-1'>
            {/* <DurationSvg className='my-auto' width={30} height={35} /> */}
            <View>
              <View className='flex flex-row'>
                <Text className='text-xs font-sanBold_700 '>Duration</Text>
                <Text className='text-xs tracking-tighter ml-1'>(Approx.)</Text>
              </View>
              <Text className='text-sm font-sanBold_700 text-custom_orange-500 opacity-75'>
                {order.duration}
              </Text>
            </View>
          </View>
        </View>
        <View className='self-end   '>
          <Text className='text-xs font-sanSmall_300'>{time}</Text>
        </View>
      </View>

      <View className='w-full border-t-2  border-t-custom_white-700 flex-row justify-between py-2 '>
        <View className='flex-row'>
          <Text className='text-[16px] font-sanBold_500 text-custom_white-600 items-end ml-2'>
            TZS {formatMoneyWithCommas(order.fee)}
          </Text>
        </View>
        <View className=''>
          <Text className='text-xs  font-sanSmall_300 '>Fee</Text>
          <Text className='text-start self-start text-xs font-sanBold_500 text-custom_red-200 opacity-70'>
            
            TZS {formatMoneyWithCommas(order.companyFee)}/=
          </Text>
        </View>
      </View>
    </View>
  )
}
const SingleSharingOrder = ()=>{
  return (
    <View>
      <Text>Single Sharing</Text>
    </View>
  )

} 

export default AcceptDeliveries