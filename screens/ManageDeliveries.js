import { View, Text, BackHandler, StatusBar, Image, TouchableOpacity, TextInput, ActivityIndicator, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, AnimatedRegion, Callout, Polyline } from 'react-native-maps'
import React, { useEffect, useState, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import apiKeyConfig from '../apiKeyConfig'
import * as Location from 'expo-location'
import { useDispatch, useSelector } from 'react-redux'
import BikeImage from '../assets/images/bike.png'
import * as Icon from 'react-native-feather'
import { useMemo } from 'react'
import MapViewDirections from 'react-native-maps-directions'
import LoadingScreen from './LoadingScreen'

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import useFetch from '../hooks/useFetch'
import { removeDelivery } from '../store/deliverySlice'
import BackButton from '../components/BackButton'
import { callNumber } from '../libs/utils'
const ManageDeliveries = () => {
  const bottomSheetModalRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const snapPoints = useMemo(() => ['75%', '75%'], [])
  
  function handlePresentModal() {
    bottomSheetModalRef.current?.present()
    setIsOpen(true)
  }
  function handleCloseModal() {
  // Close the Gorhom modal
  bottomSheetModalRef.current?.dismiss();
}
  const [duration, setDuration] = useState('')
  const [distance, setDistance] = useState('')
 const data = useSelector((state) => state.delivery.deliveries.pending)
 

 const animateMarker = (newCoordinate)=>{
    if (markerRef.current) {
      markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000)
    }
 }
 
 const mapRef = useRef()
 const markerRef = useRef()
  const navigation = useNavigation()
  const handleBackButton = () => {
    navigation.goBack()
    return true
  }
  // const [region, setRegion] = useState({ 
  //   latitude: 0,
  //   longitude: 0,
  //   longitudeDelta: 0.003,
  //   latitudeDelta: 0.003,
  // })
  const [driverLocation, setDriverLocation] = useState({
    latitude: 0,
    longitude: 0,
    longitudeDelta: 0.003,
    latitudeDelta: 0.003,
    heading:0,
  })
  const [destinationLocation, setDestinationLocation] = useState({
   latitude: 0,
   longitude: 0,
  })
 
  useEffect(()=>{
   if(destinationLocation.latitude !== 0 && destinationLocation.longitude !== 0 && driverLocation.latitude !== 0 && driverLocation.longitude !== 0){
    if(mapRef.current){
    mapRef.current.animateToRegion(
      {
        latitude: (destinationLocation.latitude + driverLocation.latitude) / 2, // Calculate the average latitude
        longitude: (destinationLocation.longitude + driverLocation.longitude) / 2, // Calculate the average longitude
        longitudeDelta: Math.abs(destinationLocation.longitude - driverLocation.longitude) * 1.2, // Adjust the factor as needed
        latitudeDelta: Math.abs(destinationLocation.latitude - driverLocation.latitude) * 1.2, // Adjust the factor as needed
      },
      1000
    )}
   }

  }, [destinationLocation])
  
  useEffect(() => {
    // Request permission to access the device's location
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.error('Permission to access location was denied')
        return
      }

      // Start tracking the driver's location
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 30000, // Update location every 2 seconds (adjust as needed)
          distanceInterval: 4,
        },
        (location) => {
          // Update the driver's location in the state whenever it changes
          
          const latitude =location.coords.latitude
          const longitude = location.coords.longitude
          const heading =location.coords.heading
          animateMarker({latitude, longitude})
          setDriverLocation((state) => {
            if (state.latitude === 0 || state.longitude === 0) {
             mapRef.current &&  mapRef.current.animateToRegion(
                {
                  latitude,
                  longitude,
                  longitudeDelta: 0.003,
                  latitudeDelta: 0.003,
                },
                1000
              )
            }
            return {
              latitude,
              longitude,
              heading,
              longitudeDelta: 0.003,
              latitudeDelta: 0.003,
            }
          })
        }
      )

      return () => {
        // Clean up by stopping location tracking when the component unmounts
        if (locationSubscription) {
          locationSubscription.remove()
        }
      }
    })()
  }, [])
 

  

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

  //modals
  const [viewDetails, setViewDetails] = useState(true)
  const [typeRender, setTypeRender] = useState('sender')

  // {"agent_id": "25d9e00b-4f30-476b-8b78-47e6d66b4ee1", "created_at": "2023-09-30T13:30:20.338370Z", "location": "", "order_id": "f3ab7d2e-e1d1-40e3-b1b8-0284e8a72fb9", "receiver_id": {"location_id": {"extra": null, "geocode": "Bagamoyo ,HVFX+C2 Bagamoyo, Tanzania", "latitude": -6.426377913057749, "latitudeDelta": 0.620650867278969, "longitude": 38.897580709308386, "longitudeDelta": 0.333450548350811}, "name": "Ujjy", "phone": ".9996"}, "sender_id": {"location_id": {"extra": null, "geocode": "Kinondoni ,66X2+8G Dar es Salaam, Tanzania", "latitude": -6.7516722, "latitudeDelta": 0.003, "longitude": 39.201334, "longitudeDelta": 0.003}, "name": "Hnj", "phone": "966"}, "status": "pending", "updated_at": "2023-09-30T18:46:35.695476Z"}

  const orderDetail = [
   {label:'sender', data:data?.sender_id},{label:'receiver', data:data?.receiver_id}
  ]
  // useEffect(
  //  ()=>{
  //   const details = typeRender==='sender'? data.sender_id: data.receiver_id
  //   setDestinationLocation(
  //    details.location_id

  //   )

  //  }, [typeRender]
  // )

 

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'gray' }}>
      <BottomSheetModalProvider>
        <SafeAreaView
          className=' flex-1 bg-custom_white-500 font-sanBold_500'
          keyboardShouldPersistTaps={'handled'}
        >
          {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
          {/* <StatusBar barStyle='dark-content' backgroundColor='#808080' /> */}

          {!data && (
            <View className='relative w-full h-full'>
              <BackButton />

              <View className='flex-row mx-auto absolute  bottom-10 bg-custom_white-100 p-2 rounded-lg  left-3 z-10'>
                <Pressable
                  onPress={() => navigation.navigate('AcceptDeliveries')}
                >
                  <Text className='text-custom_blue-200 font-sanBold_700 my-auto ml-1 text-lg'>
                    View Orders
                  </Text>
                </Pressable>
              </View>

              {/* <View className='absolute z-10 top-2  left-36 p-2 w-1/2 mx-auto bg-white rounded-lg'>
                <Text className='text-custom_orange-500'>
                  No Deliveries Found
                </Text>
              </View> */}
              <MapView
                ref={mapRef}
                initialRegion={driverLocation}
                followsUserLocation={true}
                showsUserLocation={true}
                showsMyLocationButton={true}
                style={{ height: '100%', width: '100%' }}
              >
                <Marker.Animated
                  coordinate={new AnimatedRegion(driverLocation)}
                  ref={markerRef}
                >
                  <Image
                    source={BikeImage}
                    style={{
                      width: 40,
                      height: 40,
                      transform: [{ rotate: `${driverLocation.heading}deg` }],
                    }}
                    resizeMode='contain'
                  />
                </Marker.Animated>
              </MapView>
            </View>
          )}
          {data && (
            <View className='relative'>
              <MapView
                ref={mapRef}
                initialRegion={driverLocation}
                followsUserLocation={true}
                showsUserLocation={true}
                showsMyLocationButton={true}
                style={{ height: '100%', width: '100%' }}
              >
                <Marker.Animated
                  coordinate={new AnimatedRegion(driverLocation)}
                  ref={markerRef}
                >
                  <Image
                    source={BikeImage}
                    style={{
                      width: 40,
                      height: 40,
                      transform: [{ rotate: `${driverLocation.heading}deg` }],
                    }}
                    resizeMode='contain'
                  />
                </Marker.Animated>
                <Marker.Animated
                  coordinate={destinationLocation}
                  title={typeRender.toUpperCase()}
                >
                  <Callout tooltip>
                    <View className='border bg-custom_blue-900 p-1 rounded-lg'>
                      <Text className='text-sm text-custom_white-100'>
                        {typeRender.toUpperCase}'s Location
                      </Text>
                    </View>
                  </Callout>
                </Marker.Animated>
                <MapViewDirections
                  origin={driverLocation}
                  destination={destinationLocation}
                  resetOnChange={false}
                  apikey={apiKeyConfig}
                  optimizeWaypoints={true}
                  strokeWidth={5}
                  mode='DRIVING'
                  strokeColor='hotpink'
                  onReady={(data) => {
                    console.log('bundlefdafa')
                    setDuration(data.duration.toFixed(2))
                    setDistance(data.distance.toFixed(2))
                  }}
                ></MapViewDirections>
              </MapView>
              <View className=' pl-2 absolute top-0 w-80 rounded-b  h-14  flex flex-row justify-around items-center bg-custom_blue-200'>
                
                <View className='flex flex-row space-x-2'>
                  
                  <Text className=' text-custom_white-100 text-3xl font-sanBold_700'>
                    {duration} min
                  </Text>
                </View>
                <Text className='text-3xl font-sanBold_700 text-custom_white-100'>{distance} Km</Text>
              </View>
              <View className='absolute bottom-0  w-full'>
                {!viewDetails && (
                  <TouchableOpacity
                    className='p-2   w-44 rounded-2xl shadow-2xl mb-10 ml-5 bg-custom_white-100 border  border-custom_white-600 '
                    onPress={() => setViewDetails(true)}
                  >
                    <View className='flex-row mx-auto'>
                      <Icon.ArrowUpCircle
                        width={30}
                        height={30}
                        className=' text-custom_blue-200'
                      />
                      <Text className='text-custom_blue-200 font-sanBold_700 my-auto ml-1 text-lg'>
                        View Details
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {viewDetails && (
                  <View
                    className='border w-full  h-80
             rounded-t-3xl bg-custom_white-400'
                  >
                    <View className='mt-4 ml-4 flex-row  justify-around'>
                      <TouchableOpacity
                        className={` ${
                          typeRender !== 'sender'
                            ? 'border'
                            : 'bg-custom_blue-500'
                        }  p-2 rounded ml-2 w-24`}
                        onPress={() => {
                          setTypeRender((prev) => {
                            setDestinationLocation(data.sender_id.location_id)
                            return 'sender'
                          })
                        }}
                      >
                        <Text
                          className={`font-sanBold_500 text-center ${
                            typeRender !== 'sender'
                              ? ' text-custom_blue-500'
                              : 'text-custom_white-400'
                          } `}
                        >
                          Sender
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className={` ${
                          typeRender !== 'receiver'
                            ? 'border'
                            : 'bg-custom_blue-500'
                        }  p-2 rounded ml-2 w-24`}
                        onPress={() => {
                          setTypeRender((prev) => {
                            setDestinationLocation(data.receiver_id.location_id)
                            return 'receiver'
                          })
                        }}
                      >
                        <Text
                          className={`font-sanBold_500 text-center ${
                            typeRender !== 'receiver'
                              ? ' text-custom_blue-500'
                              : 'text-custom_white-400'
                          } `}
                        >
                          Receiver
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className='mx-2'>
                      <View className='flex-row mt-3'>
                        <Text className='font-sanBold_700 my-auto mr-1'>
                          Payment Status
                        </Text>
                        <Text
                          className={` ${
                            data.paymentWith === 'cash'
                              ? ' text-custom_orange-500'
                              : ' text-custom_blue-200'
                          }  p-2 shadow  my-auto text-center rounded-lg `}
                        >
                          {data.paymentWith === 'cash' ? 'Pending' : 'Paid'}
                        </Text>
                      </View>
                    </View>
                    <View className='flex-row mx-2 mt-3'>
                      {orderDetail.map((type, ind) => (
                        <SingleDetail
                          label={type.label}
                          data={type.data}
                          typeRender={typeRender}
                        />
                      ))}
                    </View>
                    <View className=' mt-9 flex-row justify-around'>
                      <TouchableOpacity
                        className='p-2 rounded-lg bg-custom_blue-500 w-44'
                        onPress={handlePresentModal}
                      >
                        <Text className='text-custom_white-400 text-center'>
                          {data.paymentWith === 'cash'
                            ? 'Delivered & Paid'
                            : 'Delivered'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className='p-2 bg-custom_blue-200 rounded-lg shadow-2xl w-44'
                        onPress={() => {
                          mapRef.current?.animateToRegion(driverLocation)
                          setViewDetails(false)
                        }}
                      >
                        <Text className='font-sanBold_700  text-custom_white-400 text-center'>
                          Continue Delivering
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        </SafeAreaView>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{ borderRadius: 30, backgroundColor: '#f0f0f0' }}
          onDismiss={() => setIsOpen(false)}
        >
          <RatingModal
            delivery_id={data?.delivery_id}
            sender={data?.sender_id.name}
            receiver={data?.receiver_id.name}
            closeModal={handleCloseModal}
            order_id={data?.order_id}
          />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}
const RatingModal = ({delivery_id, sender, receiver, closeModal, order_id})=>{
 const token = useSelector(state=>state.auth.user_data.token)
 const {obtainData, error, isLoading, data} = useFetch()

 const [ratings, setRatings] = useState(0)
 const [comment, setComment] = useState('')
 console.log(ratings)
const ratingDescription = {
  1: 'Very Poor',
  2: 'Below Average',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
}
 const handleSubmit = () => {
   obtainData('agent/order/feedback', 'post', {
     delivery_id,
     rating: ratings,
     comment,
     order_id
   }, {
    headers:{
      Authorization: `Bearer ${token}`
    }
   })

 }
 const dispatch = useDispatch()
 useEffect(
  ()=>{
   if(data){
    dispatch(removeDelivery({type:'REMOVE_PENDING', data:{delivery_id}}))
     closeModal()
   }

  }, [data]
  
 )

 return (
   <View className='w-full h-full flex  items-center  '>
     <Text className=' font-sanBold_500 text-lg mt-9'>Rate Delivery</Text>
    
     <Text className='font-sanBold_700 text-custom_blue-200 mt-4'>
     {ratings>0?ratingDescription[`${ratings}`]:'Click to Rate'}

     </Text>
     <View className='flex flex-row mx-auto mt-4'>
       {Array(5)
         .fill()
         .map((_, i) => {
           if (i + 1 <= ratings) {
             return (
               <Icon.Star
                 color={'#FFD700'}
                 className='m-1'
                 height={40}
                 width={40}
                 fill={'#FFD700'}
               />
             )
           } else {
             return (
               <Icon.Star
                 className='m-1'
                 color={'#000'}
                 height={25}
                 width={25}
                 fill={'#808080'}
                 onPress={()=>setRatings(i+1)}
               />
             )
           }
         })}
     </View>
       <TextInput
       textAlignVertical='top'
                  className='border pt-2  rounded-lg px-2  mx-2 mt-5 bg-custom_white-100'
                  multiline={true}
                  numberOfLines={5}
                  focusable={true}
                  placeholder='Extra Information (Optional) '
                  value={comment}
                  onChangeText={(e) => {
                   console.log(e)
                 setComment(e)
                  }}
                  
                />
            <TouchableOpacity className='p-2 bg-custom_blue-200 rounded w-1/2 mt-10' onPress={handleSubmit}>
             <Text className='text-center font-sanBold_700 text-custom_white-400'>{isLoading? <ActivityIndicator color={'white'}/>: 'Submit'}</Text>
            </TouchableOpacity>


   </View>
 )
}
const SingleDetail = ({data, label, typeRender})=>{
  // {"agent_id": "25d9e00b-4f30-476b-8b78-47e6d66b4ee1", "created_at": "2023-09-30T13:30:20.338370Z", "location": "", "order_id": "f3ab7d2e-e1d1-40e3-b1b8-0284e8a72fb9", "receiver_id": {"location_id": {"extra": null, "geocode": "Bagamoyo ,HVFX+C2 Bagamoyo, Tanzania", "latitude": -6.426377913057749, "latitudeDelta": 0.620650867278969, "longitude": 38.897580709308386, "longitudeDelta": 0.333450548350811}, "name": "Ujjy", "phone": ".9996"}, "sender_id": {"location_id": {"extra": null, "geocode": "Kinondoni ,66X2+8G Dar es Salaam, Tanzania", "latitude": -6.7516722, "latitudeDelta": 0.003, "longitude": 39.201334, "longitudeDelta": 0.003}, "name": "Hnj", "phone": "966"}, "status": "pending", "updated_at": "2023-09-30T18:46:35.695476Z"}
  const disp = typeRender===label
  data.extra= true
  const handlePlacePhone= ()=>{
    callNumber(data.phone)
  }
  return (
    <View
      className={`w-48 mx-1 ${
        disp && ' bg-custom_white-100 rounded-lg shadow px-1'
      }`}
    >
      <View className='flex-row justify-between my-1'>
        <Text
          className={` ${
            !disp && ' text-custom_white-600'
          } font-sanBold_700 mr-1 w-1/4`}
        >
          Name
        </Text>
        <Text
          className={`${
            !disp && ' text-custom_white-600'
          } font-sanRegular_500 w-3/4`}
        >
          {data.name}
        </Text>
      </View>
      <View className='flex-row  justify-between my-1'>
        <Text
          className={` ${
            !disp && ' text-custom_white-600'
          } font-sanBold_700 mr-1 w-1/4`}
        >
          Phone
        </Text>
        <Text
          className={`${
            !disp && ' text-custom_white-600'
          } font-sanRegular_500 w-3/4`}
        >
          +255638630936
        </Text>
      </View>
      {data.location_id.extra && (
        <View className='flex-row justify-between my-1'>
          <Text
            className={` ${
              !disp && ' text-custom_white-600'
            } font-sanBold_700 mr-1 w-1/4`}
          >
            Extra:
          </Text>
          <Text
            className={`${
              !disp && ' text-custom_white-600'
            } font-sanRegular_500 w-3/4`}
          >
            {data.location_id.extra}
          </Text>
        </View>
      )}
      {disp && (
        <TouchableOpacity
          className='border p-2 rounded-lg  w-1/2 border-custom_blue-200 my-2 '
          onPress={handlePlacePhone}
        >
          <View className='mx-auto flex-row'>
            <Icon.PhoneCall
              width={20}
              height={20}
              className=' text-custom_blue-200'
            />
            <Text className='ml-1 font-sanBold_500 '>Call</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default ManageDeliveries
