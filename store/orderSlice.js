import { createSlice, nanoid } from '@reduxjs/toolkit'
import { driverSingleClosePointsCheck } from '../algorithms'
import { sortByDate } from '../libs/utils'
// [{'category': 'Sortables', 'fee': 1000.0, 'user_id': UUID('ae14ad5c-2712-4106-9e8d-6460102ef000'), 'payment_means': 'instant', 'payment_method': 'cash', 'payment_by': 'sender', 'sender_id': {'name': 'Sss', 'phone': '5588', 'location_id': {'geocode': 'Kinondoni ,66X2+8G Dar es S55, 'longitudeDelta': 0.002999715507030487, 'extra': None}}, 'receiver_id': {'name': 'Rrds', 'phone': '0965', 'location_id': {'geocode': 'Kinondoni ,753X+5G, Dar es Salaam, Tanzania', 'latitude': -6.747928497617519, 'longitude': 39.19941237196326, 'latitudeDelta': 0.006005483548243262, 'longitudeDelta': 0.002999715507030487, 'extra': None}}, 'status': 'pending'}, {'category': 'Sortables', 'fee': 1000.0, 'user_id': UUID('ae14ad5c-2712-4106-9e8d-6460102ef000'), 'payment_means': 'instant', 'payment_method': 'digital', 'payment_by': 'sender', 'sender_id': {'name': 'Sss', 'phone': '5588', 'location_id': {'geocode': 'Kinondoni ,66X2+8G Dar es Salaam, Tanzania', 'latitude': -6.751672213084754, 'longitude': 39.201333839446306, 'latitudeDelta': 0.006005437106305855, 'longitudeDelta': 0.002999715507030487, 'extra': None}}, 'receiver_id': {'name': 'Rrds', 'phone': '0965', 'location_id': {'geocode': 'Kinondoni ,753X+5G, Dar es Salaam, Tanzania', 'latitude': -6.747928497617519, 'longitude': 39.19941237196326, 'latitudeDelta': 0.006005483548243262, 'longitudeDelta': 0.002999715507030487, 'extra': None}}, 'status': 'pending'}]
const initialState = {
 orders: {
  instant: [],
  sharing: [],

 },
 location: {
  latitude: 0,
  longitude: 0
 }
}

const driverCloseInstants = (instant, driverLatitude, driverLongitude)=>{

  return instant.filter((ord)=>{
    const {latitude, longitude} = ord.sender_id.location_id
    const isClose = driverSingleClosePointsCheck(driverLatitude, driverLongitude, latitude, longitude)
    return isClose
    })
}

const orderSlice = createSlice(
 {
  name:'order',
  initialState,
  reducers:{
   addOrders: (state, action)=>{
    const {data, type} = action.payload
    const {orders, location} =data
    orders.sort((a, b)=> new Date(b.created_at) - new Date(a.created_at))
    const { latitude: driverLatitude, longitude: driverLongitude } = location
    switch(type){
    case 'ADD_SINGLE_ORDER':
      //check if the order is instant or sharing
      // let instant = orders.filter(order=>order.payment_means==='instant')
    
     break
    case 'ADD_ORDERS':
     // group for sharing and instant
  
     
     let instant = orders.filter(order=>order.payment_means==='instant')
     let sharing = orders.filter(order=>order.payment_means!=='instant')
    

     //update states
     const newInstant = [
       ...driverCloseInstants(instant, driverLatitude, driverLongitude),

     ]
     const newSharing = [
        ...sharing,
      
     ]

     //sort them by date
     newInstant.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
     newSharing.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
     state.orders.instant = newInstant
     state.orders.sharing = newSharing
     state.location = location
  
     break
    }


   },
   removeOrder: (state, action)=>{
    const {type, data} = action.payload;
    switch(type){
     case 'REMOVE_INSTANT':
      state.orders.instant = state.orders.instant.filter((ord)=> ord.order_id !==data.order_id)
    }
   }
  }
 }
)
export const { addOrders, removeOrder} = orderSlice.actions
export default orderSlice.reducer
