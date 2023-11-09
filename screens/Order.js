import { View, Text, StatusBar, ScrollView, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api'
import Spinner from 'react-native-loading-spinner-overlay'
import * as Icon from 'react-native-feather'
import { useNavigation } from '@react-navigation/native'
import { formatDate } from '../formatters'
import { formatFullDate } from '../libs/utils'
import { formatMoneyWithCommas } from '../formatters'
import bulk from '../assets/images/services/bulk.png'
import documentImg from '../assets/images/services/document.png'
import sortable from '../assets/images/services/sortable.png'
import fragile from '../assets/images/services/fragile.png'
const orderImg = {
  Bulk: bulk,
  Document: documentImg,
  Fragile: fragile,
  Sortables: sortable,
}
const Order = () => {
const user_data = useSelector((state) => state.auth.user_data)
  const navigation = useNavigation()
  const getAllTransactions=async()=>{
    const res = await api.get('/agent/orders/delivered', {
      headers: {
        Authorization: `Bearer ${user_data.token}`,
      },
    })
    return res.data
  }
  const {data, isLoading} = useQuery({
    queryKey: ['transactions'],
    queryFn: getAllTransactions,
    refetchOnWindowFocus:true,
    onSuccess: (data) => {
     
    }

  })



  return (
    <SafeAreaView className=' flex-1 bg-custom_white-500'>
      {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
      <StatusBar barStyle='dark-content' backgroundColor='#808080' />
      <Spinner visible={isLoading} textContent='Loading' />
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
      <ScrollView className='p-3 px-5'>{
        data?.orders && data?.orders.map((item, index) => {

          return (
            <View>
           <SingleDeliveredOrder order={item} />  
            </View>
          )
        })
      }</ScrollView>
    </SafeAreaView>
  )
}
const SingleDeliveredOrder = ({ order }) => {
  const navigation = useNavigation()
  const color = order.status === 'delivered' ? '#007736' : '#FF0000'

  return (
    <Pressable
     
      className='py-2'
    >
      <View className='flex flex-row py-2'>
        <View className='relative '>
          <Image
            source={orderImg[order.category]}
            className='w-16 h-16  rounded'
          />
          <Text className='absolute  top-5 pr-2  text-xs rounded-r-full bg-custom_blue-200/80 bg-opacity-40 text-custom_white-100 '>
            {order.category}
          </Text>
        </View>
        <View className='flex flex-row justify-between w-3/4 pl-2 border-b'>
          <View className='self-center'>
            <Text className='text-xs font-medium flex flex-row'>
              <Text className='font-normal'> Delivery ID:</Text> #
              {order.order_id.substring(0, 7)}
            </Text>
            <Text className='font-medium text-xs text-custom_white-600 mt-1'>
              {formatFullDate(order.created_at)}
            </Text>
          </View>
          <View className='self-center '>
            <Text
              className={`font-bold text-xs text-[${color}]  mt-1 uppercase`}
              style={{
                color: color,
              }}
            >
              {order.status}
            </Text>

            <Text className='font-medium text-xs text-center text-custom_blue-200  mt-1'>
              {formatMoneyWithCommas(order.fee)} /=
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export default Order