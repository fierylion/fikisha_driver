 import { View, Text, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native'
 import * as Icon from 'react-native-feather'
 import { SafeAreaView } from 'react-native-safe-area-context'
 import React,{useState, useRef, useEffect, useMemo} from 'react'
 import { useNavigation, useRoute } from '@react-navigation/native'
 import { generateFormattedDateTime,formatMoneyWithCommas } from '../formatters'
 import DurationSvg from '../assets/images/acceptDeliveries/duration.svg'
 import DistanceSvg from '../assets/images/acceptDeliveries/distance.svg'
 import { GestureHandlerRootView } from 'react-native-gesture-handler'
 import * as Location from 'expo-location'
 import {
   BottomSheetModal,
   BottomSheetModalProvider,
 } from '@gorhom/bottom-sheet'
 import MapRoute from '../components/MapRoute'
 import useFetch from '../hooks/useFetch'
 import { useDispatch, useSelector } from 'react-redux'
 import { removeOrder } from '../store/orderSlice'
 import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
 import {api} from '../api'
 const InstantDetails = ({route}) => {
  const queryClient =useQueryClient()
  const bottomSheetModalRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const snapPoints = useMemo(() => ['90%', '90%'], [])
  const navigation = useNavigation()
  function handlePresentModal() {
    bottomSheetModalRef.current?.present()
    setIsOpen(true)
  }
 const {order} = route.params
 const [data, setData] = useState(order)

 const token= useSelector(state=>state.auth.user_data.token)
 const dispatch = useDispatch()

 const obtainDriverLocation = async () => {
     // get driver location
     // return driver location

     let { status } = await Location.requestForegroundPermissionsAsync()
     if (status !== 'granted') {
       Alert.alert('Location permission is required to use this feature')
       return
     }
     let location = await Location.getCurrentPositionAsync({})
     return {
       latitude: location.coords.latitude,
       longitude: location.coords.longitude,
       heading:location.coords.heading,
       latitudeDelta:0.003,
       longitudeDelta:0.003
     }
   }
 const submitAcceptDelivery = async () => {
  const location = await obtainDriverLocation()
  const response = await api.post(
    `/agent/place_order/${data.order_id}`,{
      location
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

  )
  return response.data
 }


 // using react query
 const { mutate, isLoading } = useMutation({
   mutationFn: submitAcceptDelivery,
   onSuccess: (dt) => {
     dispatch(
       removeOrder({
         type: 'REMOVE_INSTANT',
         data: { order_id: data.order_id },
       })
     )
     queryClient.invalidateQueries({ queryKey: ['pendingOrders'] })
     
     navigation.navigate('DeliveryConfirmed')
   },
 })


   return (
     <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'gray' }}>
      <BottomSheetModalProvider>
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
         <Text className='mx-auto font-sanBold_500 text-lg'>Details</Text>
         <Icon.ArrowLeft />
       </View>
       <View className='h-20'></View>

       <View>
         <View className='rounded-t-3xl h-full w-full bg-custom_white-400'>
           <View className='mx-4 mt-5'>
             <View className='flex flex-row justify-between bg-custom_blue-200 rounded  px-2'>
               <View className='p-2'>
                 <Text className='text-custom_white-400  font-sanBold_500'>
                   Category
                 </Text>
                 <Text className='text-custom_white-400 font-sanRegular_400 mt-2'>
                   {data.category}
                 </Text>
               </View>
               <View className='p-2'>
                 <Text className='text-custom_white-400  font-sanBold_500'>
                   Date
                 </Text>
                 <Text className='text-custom_white-400 font-sanRegular_400 mt-2'>
                   {generateFormattedDateTime(data.created_at)}
                 </Text>
               </View>
             </View>
             <View className='bg-custom_white-100 mt-3 rounded shadow p-2 px-4 flex-row justify-between '>
               <View className='flex-row mt-1 mr-2'>
                 <DistanceSvg className='my-auto' width={25} height={35} />
                 <View>
                   <Text className='text-xs font-sanBold_700 '>Distance</Text>
                   <Text className='text-sm font-sanBold_700 text-custom_orange-500 opacity-75'>
                     {order.distance}
                   </Text>
                 </View>
               </View>
               <View className='flex-row mt-1'>
                 <DurationSvg className='my-auto' width={25} height={35} />
                 <View>
                   <View className='flex flex-row'>
                     <Text className='text-xs font-sanBold_700 '>Duration</Text>
                     <Text className='text-xs tracking-tighter ml-1'>
                       (Approx.)
                     </Text>
                   </View>
                   <Text className='text-sm font-sanBold_700 text-custom_orange-500 opacity-75'>
                     {data.duration}
                   </Text>
                 </View>
               </View>
             </View>
             <View className='bg-custom_white-100 mt-3 rounded shadow px-2'>
               <Text className='font-sanBold_400 text-lg'>Sender</Text>
               <Text className='font-sanBold_500 capitalize tracking-wide my-1'>
                 {data.sender_id.name}
               </Text>
               <View className='flex-row'>
                 <Icon.MapPin
                   width={20}
                   height={30}
                   className=' text-custom_blue-200 mr-2'
                 />
                 <Text className='text-xs my-auto font-sanSmall_300 tracking-tighter w-1/2'>
                   {data.sender_id.location_id.geocode}
                 </Text>
               </View>
               <View className='flex-row'>
                 <Icon.PhoneOutgoing
                   width={20}
                   height={30}
                   className=' text-custom_blue-200 mr-2'
                 />
                 <Text className='text-xs my-auto  font-sanSmall_300 tracking-tighter'>
                   {data.sender_id.phone}
                 </Text>
               </View>
               {data.sender_id.extra && (
                 <View className='flex-row'>
                   <Icon.Info
                     width={20}
                     height={30}
                     className=' text-custom_blue-200 mr-2'
                   />
                   <Text className='text-xs my-auto  w-1/2  font-sanSmall_300 tracking-tighter'>
                     {data.sender_id.extra}
                   </Text>
                 </View>
               )}
             </View>
             <View className='bg-custom_white-100 mt-3 rounded shadow px-2'>
               <Text className='font-sanBold_400 text-lg'>Receiver</Text>
               <Text className='font-sanBold_500 capitalize tracking-wide my-1'>
                 {data.receiver_id.name}
               </Text>
               <View className='flex-row'>
                 <Icon.MapPin
                   width={20}
                   height={30}
                   className=' text-custom_blue-200 mr-2'
                 />
                 <Text className='text-xs my-auto font-sanSmall_300 tracking-tighter w-1/2'>
                   {data.receiver_id.location_id.geocode}
                 </Text>
               </View>
               <View className='flex-row'>
                 <Icon.PhoneOutgoing
                   width={20}
                   height={30}
                   className=' text-custom_blue-200 mr-2'
                 />
                 <Text className='text-xs my-auto  font-sanSmall_300 tracking-tighter'>
                   {data.receiver_id.phone}
                 </Text>
               </View>
               {data.receiver_id.extra && (
                 <View className='flex-row'>
                   <Icon.Info
                     width={20}
                     height={30}
                     className=' text-custom_blue-200 mr-2'
                   />
                   <Text className='text-xs my-auto  w-1/2  font-sanSmall_300 tracking-tighter'>
                     {data.receiver_id.extra}
                   </Text>
                 </View>
               )}
             </View>
             <View className='bg-custom_white-100 mt-3 rounded shadow p-2'>
               <View className='flex flex-row '>
                 <Text className='font-sanBold_500 text-lg'>Payment</Text>
                 <Text className=' self-center ml-1  text-custom_blue-200 text-xs'>
                   (TZS)
                 </Text>
               </View>

               <View className='flex-row justify-between my-1'>
                 <Text className='text-xs font-sanBold_500   my-auto tracking-wider'>
                   Fare:
                 </Text>
                 <Text className='self-start tracking-normal ml-2 font-sanBold_700 '>
                   {formatMoneyWithCommas(data.fee)} /=
                 </Text>
               </View>
               <View className='flex-row justify-between my-1'>
                 <Text className='text-xs font-sanBold_500   my-auto tracking-wider'>
                   Fee:
                 </Text>
                 <Text className='self-start tracking-normal ml-2 font-sanBold_700'>
                   {formatMoneyWithCommas(data.companyFee)} /=
                 </Text>
               </View>
               <View className='flex-row justify-between my-1 border-t-2 pt-2'>
                 <Text className='text-xs font-sanBold_500    my-auto tracking-wider'>
                   Earnings:
                 </Text>
                 <Text className='self-start  font-sanBold_700  tracking-normal ml-2'>
                   {formatMoneyWithCommas(data.fee - data.companyFee)} /=
                 </Text>
               </View>
             </View>
             <View className='flex flex-row justify-between p-2 mx-4 mt-3'>
               <TouchableOpacity className='p-2 shadow-lg rounded  bg-custom_blue-200' onPress={()=>handlePresentModal()}>
                 <Text
                 className='text-custom_white-400 font-sanBold_500'
                 >View Map</Text>
               </TouchableOpacity>
               <TouchableOpacity className='p-2 shadow-lg rounded  bg-custom_blue-200' onPress={mutate}>
               {isLoading? <ActivityIndicator color={'#fff'}/>:
                 <Text className=' text-custom_white-400 font-sanBold_500'>Start Route</Text>}
               </TouchableOpacity>
             </View>
           </View>
         </View>
       </View>
     </SafeAreaView>
     <BottomSheetModal
     ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={{ borderRadius: 30, backgroundColor: '#D3D3D3' }}
      onDismiss={()=>setIsOpen(false)}

     >
     <MapRoute origin={data.sender_id.location_id} destination={data.receiver_id.location_id} />
     

     </BottomSheetModal>
     </BottomSheetModalProvider>
     </GestureHandlerRootView>
   )
 }
 
 export default InstantDetails