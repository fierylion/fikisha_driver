import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import requestSlice from './requestSlice'
import orderSlice from './orderSlice'
import deliverySlice from './deliverySlice'
const store = configureStore({
 reducer: {auth:authReducer, request:requestSlice, order:orderSlice, delivery:deliverySlice}
})
export { store }
