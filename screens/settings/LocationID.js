import { View, Text, ScrollView, KeyboardAvoidingView, Pressable } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { BackHandler } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import * as Icon from 'react-native-feather'
import MapSinglePoint from '../../components/MapSinglePoint'
import Modal from 'react-native-modal'
import LocationIdModal from '../../components/LocationIdModal'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import { api } from '../../api'
import { useQuery } from '@tanstack/react-query'

import { formatMoneyWithCommas } from '../../formatters'
const LocationID = () => {
     const navigation = useNavigation()
     
     const handleBackButton = () => {
       navigation.goBack()
       return true
     }
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
  const [location, setLocation] = React.useState(null)
  const [showModal, setShowModal] = React.useState(false)
   const bottomSheetModalRef = useRef(null)
  useEffect(() => {
    if(location) bottomSheetModalRef.current?.present();

  }, [location])

  const user_data = useSelector((state) => state.auth.user_data)
  const getAllTransactions = async () => {
    const res = await api.get('/agent/transactions', {
      headers: {
        Authorization: `Bearer ${user_data.token}`,
      },
    })
    return res.data
  }
  const { data, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getAllTransactions,
    onSuccess: (data) => {
     console.log(data)
    },
  })
 let totalEarned =0
 let fee = 0
 if(data?.payments?.length>0){
  let payments = data.payments[0]
  totalEarned = payments.amount
  fee = payments.fee
 }
 
  const snapPoints = ['80%', '80%']
  return (
    <SafeAreaView
      className=' flex-1 bg-custom_white-500 font-sanBold_500'
      keyboardShouldPersistTaps={'handled'}
    >
      <StatusBar backgroundColor='#fff' barStyle='dark-content' />
      <View className='mt-1 flex flex-row items-center mx-3'>
        <Icon.ArrowLeft
          color={'gray'}
          height={30}
          width={30}
          onPress={() => navigation.goBack()}
        />
        <Text className='mx-auto font-sanBold_500 text-lg'>Earnings</Text>
        <Icon.ArrowLeft />
      </View>
      <View className='h-20'></View>

      <View>
        <View className='rounded-t-3xl h-full w-full bg-custom_white-400'>
          <View className='my-24 flex justify-center  items-center'>
            <View className='flex flex-row justify-around'>
              <View className='w-40 border p-2 mr-3 rounded-lg py-7 border-custom_white-600'>
                <Text className='text-center text-3xl font-sanBold_500 mb-3 '>
                  {formatMoneyWithCommas(totalEarned)}/= 
                </Text>
                <Text className='text-center font-sanBold_700 text-custom_white-600'>
                  Total Earned
                </Text>
              </View>
              <View className='w-48 border p-2 rounded-lg py-7 border-custom_white-600'>
                <Text className='text-center text-3xl font-sanBold_500 mb-3'>
                  {formatMoneyWithCommas(fee)}/= 
                </Text>
                <Text className='text-center font-sanBold_700 text-custom_white-600'>Fee</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default LocationID