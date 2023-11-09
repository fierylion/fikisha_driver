import { apiWS } from '../api'
import { View, Text, StatusBar, BackHandler, Alert, ScrollView, Image, TouchableOpacity } from 'react-native'
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
import { useQuery, useQueryClient

} from '@tanstack/react-query';
import AcceptSvg from '../assets/images/services/accept.svg'
import ManageSvg from '../assets/images/services/manage.svg'

import { addDeliveries } from '../store/deliverySlice';
import MapView from 'react-native-maps'
import { useNavigation } from '@react-navigation/native'

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
// Add a listener for the hardware back button
 useEffect(() => {
  const backHandler =  BackHandler.addEventListener('hardwareBackPress', handleBackButton)

   // Remove the listener when the component unmounts
   return () => {
    backHandler.remove()
     BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
   }
 }, [])

 
 //react query approach
 const user_data = useSelector((state) => state.auth.user_data)
 const fetchRequestOrders = async () => {
  const res = await api.get('/agent/orders', {
    headers: {
      Authorization: `Bearer ${user_data.token}`,
    },
  })
  return res.data
}

const fetchPendingOrders = async () => {
  const res = await api.get('/agent/order/pending', {
    headers: {
      Authorization: `Bearer ${user_data.token}`,
    },
  })
  return res.data
}
const { data: requestOrders, isLoading: requestLoading } = useQuery(
  {
    queryKey:['requestOrders'],
    queryFn: fetchRequestOrders,
    onSuccess: (data) => {
      //obtain driver location and dispatch it together with sharing orders and instant orders
      obtainDriverLocation().then(
        (loc)=>{
          dispatch(
            addOrders({
              data: {
                orders: data.orders,
                location: loc,
              },
              type: 'ADD_ORDERS',
            })
          )
          


        }
      ).catch(err=>console.log( err))
    }
  
  }
)
const { data: pendingOrders, isLoading: pendingLoading } = useQuery(
  {
    queryKey:['pendingOrders'],
    queryFn: fetchPendingOrders,
    onSuccess: (data) => {
   
      dispatch(
        addDeliveries({
          type: 'ADD_PENDING',
          data: {
            pending: data.order,
          },
        })
      )
    }
  })

const queryClient = useQueryClient()


//get new orders
 useEffect(() => {
  const socket = new WebSocket(`${apiWS}/order/drivers_group/`)

  socket.onmessage = (e)=>{
   
    const data = JSON.parse(e.data)
    const {type} = data
    if(type === 'new_order'){
      queryClient.invalidateQueries({queryKey:['requestOrders']})
    }

      // obtainDriverLocation()
      //   .then((loc) => {
      //     dispatch(
      //       addOrders({
      //         data: {
      //           orders: data.orders,
      //           location: loc,
      //         },
      //         type: 'ADD_ORDERS',
      //       })
      //     )
      //   })
      //   .catch((err) => console.log(err))
  }
  socket.onopen = (e)=>{
    console.log('orders connected')
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
 
 

 //driver location
  useEffect(() => {
    let locationSubscription;
    const socket = new WebSocket(`${apiWS}/location/${user_data.agent.id}/`)



    socket.onopen = (e) => {
      console.log('location connected')
    }
    socket.onerror = (e) => {
      console.log(e)
    }
    socket.onclose = (e) => {
      console.log('closed')
    };
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.error('Permission to access location was denied')
        return
      }

      // Start tracking the driver's location
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000, // Update location every 2 seconds (adjust as needed)
          distanceInterval: 2,
        },
        (location) => {
          // Update the driver's location in the state whenever it changes

          const latitude = location.coords.latitude
          const longitude = location.coords.longitude
          const heading = location.coords.heading
         try{
            
            socket.send(
              JSON.stringify({
                latitude,
                longitude,
                heading,
                longitudeDelta: 0.003,
                latitudeDelta: 0.003,
              })
            )}catch(err){
              console.log(err)
            }
          
          
        }
      )

      })();
    
    return () => {
      socket.close()
        if (locationSubscription) {
          locationSubscription.remove()
        }
    }
  }, [user_data])
const pending = useSelector((state) => state.delivery.deliveries.pending)
 const mapRef = React.useRef(null)
 const items = [
   {
     name: 'Accept Deliveries',
     description: 'Get orders and start earning on your schedule.',
     screen: 'AcceptDeliveries',
     img: AcceptSvg,
   },
   {
     name: 'Manage Deliveries',
     description: 'Efficiently track and complete your deliveries.',
     screen: 'ManageDeliveries',
     img: ManageSvg,
   },
   
 ]
 const navigation = useNavigation()
   useEffect(() => {
     if (!mapRef.current) return
     obtainDriverLocation().then((loc) => {
       console.log(loc)
       if (loc) {
         mapRef.current.animateToRegion({
           latitude: loc.latitude,
           longitude: loc.longitude,
           latitudeDelta: 0.0622,
           longitudeDelta: 0.0621,
         })
       }
     })
   }, [mapRef])
  return (
    <SafeAreaView
      className=' flex-1 bg-custom_white-500'
      edges={['top', 'left', 'right']}
    >
      {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
      <StatusBar barStyle='dark-content' backgroundColor='#808080' />
      <View className='flex-1 relative'>
        <MapView
          ref={mapRef}
          followsUserLocation={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          style={{ width: '100%', height: '100%', opacity: 0.5 }}
        ></MapView>
        <View className={`absolute bottom-0 h-[30%] rounded-t-xl inset-x-0 bg-custom_white-100`}>
          
          <View className='w-14  h-1 bg-custom_white-400 rounded-3xl mt-3 mx-auto relative'></View>
          <View className='mt-2'>
          {pending && (
            <TouchableOpacity className='p-4 mt-4 w-10/12 mx-auto  border-2 rounded-lg border-custom_orange-500' onPress={()=>{
              navigation.navigate('ManageDeliveries')
            }} >
              <Text className='text-center font-sanBold_700 text-custom_orange-500'>Continue Delivering</Text>
            </TouchableOpacity>
            )}
          <View  className='mt-3'>

       <TouchableOpacity onPress={()=>navigation.navigate('AcceptDeliveries')} className='w-10/12 mt-1 mx-auto  py-5 bg-custom_blue-200 shadow-xl rounded-xl m'>
       <Text className='text-center font-sanBold_700 text-custom_white-100'> View Orders</Text>
        </TouchableOpacity>

  


          </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Home