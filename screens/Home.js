import { View, Text, StatusBar, BackHandler, Alert, ScrollView } from 'react-native'
import React,{useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Summary from '../components/HomePageComponents/Summary'
import * as Icon from 'react-native-feather';
import {FeatureImages, Services} from '../components/HomePageComponents'
import { useSelector, useDispatch } from 'react-redux'
import { addOrders } from '../store/orderSlice'
import useFetch from '../hooks/useFetch';
import * as Location from 'expo-location'
import { api } from '../api';

import { addDeliveries } from '../store/deliverySlice';

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'



const Home = () => {


  
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
    }
  }
  
 
  const dispatch =  useDispatch()
 const handleBackButton = () => {
   // Show a confirmation dialog when the back button is pressed
   Alert.alert(
     'Exit App',
     'Do you want to exit the app?',
     [
       {
         text: 'Cancel',
         onPress: () => null, // Do nothing if the user cancels
         style: 'cancel',
       },
       {
         text: 'Exit',
         onPress: () => BackHandler.exitApp(), // Exit the app if the user confirms
       },
     ],
     { cancelable: false }
   )
   return true // Return true to prevent the default back button behavior
 }



const user_data = useSelector(state=>state.auth.user_data)

 // Add a listener for the hardware back button
 useEffect(() => {
  const backHandler =  BackHandler.addEventListener('hardwareBackPress', handleBackButton)

   // Remove the listener when the component unmounts
   return () => {
    backHandler.remove()
     BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
   }
 }, [])

 const {obtainData, error,isLoading, data} = useFetch();
 useEffect(() => {
  //NOT ACCEPTED ORDERS
  obtainData('/agent/orders', 'get', {}, {
    headers:{
      Authorization: `Bearer ${user_data.token}`

    }
  })

  //ACCEPTED PENDING ORDER
  api.get('/agent/order/pending', {
    headers: {
      Authorization: `Bearer ${user_data.token}`,
    },
  }).then(
    (dt)=>{
      dispatch(addDeliveries({
        type:'ADD_PENDING',
        data:{
          pending:dt.data.order
        }
      }))
   

    }
  ).catch(
    (err)=>console.log(err)
  )
 },[user_data])





 useEffect(
  () => {
    if (error) {
      console.log(error)
    }
    if (data) {
     


      obtainDriverLocation().then(
        (loc)=>{
         
          dispatch(
            addOrders({
              data: {
                orders: data.orders,
                location: loc,
              },
              type: 'ADD_MULTIPLE_ORDER',
            })
          )
          


        }
      ).catch(err=>console.log( err))
      
     
      
    }
  },[data, error]
 )

 useEffect(() => {
  const socket = new WebSocket('ws://192.168.12.1:8000/ws/order/drivers_group')

  socket.onmessage = (e)=>{
    

    const data = JSON.parse(e.data);
    console.log(data)
    dispatch(addOrders({data:data, type:'ADD_SINGLE_ORDER'}))
  }
  socket.onopen = (e)=>{
    console.log('connected')
  }
  socket.onerror = (e)=>{
    console.log(e)
    
  }
  socket.onclose = (e)=>{
    console.log('closed')
  }
  return ()=>{
    socket.close()
  }


 },[user_data])
 
  return (
    <SafeAreaView
      className=' flex-1 bg-custom_white-500'
      edges={['top', 'left', 'right']}
    >
      {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
      <StatusBar barStyle='dark-content' backgroundColor='#808080' />
      <View>
        <View className='flex-row justify-between mx-5 mt-2'>
          <View className=''>
            <Text className=' font-bold text-xl text-custom_blue-500'>
              Fikisha
            </Text>
            <View className='flex-row text-center'>
              <Icon.MapPin width={20} height={30} color={'gray'} />
              <Text className='self-center ml-1.5 font-bold text-sm text-custom_white-600'>
                ST, Kariakoo..
              </Text>
            </View>
          </View>
          <View className='mt-2 relative'>
            <Icon.Bell width={30} height={30} color={'gray'} />
            <Text className='absolute top-0 right-0  bg-custom_orange-500 w-2 h-2 rounded-full text-custom_white-500 text-xs'></Text>
          </View>
        </View>
      </View>
      <ScrollView>
        <FeatureImages />
        <Summary />

        <Services />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home