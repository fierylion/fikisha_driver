import { createSlice, nanoid } from '@reduxjs/toolkit'
const initialState = {
 deliveries:{
  pending:null,
  delivered: []
 }
}
const deliverySlice = createSlice(
 {
  name:'delivery',
  initialState,
  reducers:{
   addDeliveries: (state, action)=>{
    const {type, data} = action.payload;
   
    switch(type){

     case 'ADD_PENDING':
      
      state.deliveries.pending =data.pending

    }
   },
   removeDelivery: (state, action)=>{
    const {type, data} = action.payload;
    switch(type){
     case 'REMOVE_PENDING':
      state.deliveries.pending =null
    }
   }


  }

 }
)
export const{
 addDeliveries,
 removeDelivery
}=deliverySlice.actions
export default deliverySlice.reducer;