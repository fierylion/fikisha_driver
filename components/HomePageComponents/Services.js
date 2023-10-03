import { View, Text,Image, Pressable } from 'react-native'
import React from 'react'

import AcceptSvg from '../../assets/images/services/accept.svg'
import ManageSvg from '../../assets/images/services/manage.svg'
import EarningsSvg from '../../assets/images/services/report.svg'
import ChatSvg from '../../assets/images/services/communication.svg'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { modifyData } from '../../store/requestSlice'
const Services = () => {
  const navigation = useNavigation()
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
  {
    name: 'Earnings Report',
    description: 'View your earnings and payment history.',
    screen: 'EarningsReport',
    img: EarningsSvg,
  },
  {
    name: 'Client Chat',
    description: 'Stay in touch with your customers ',
    screen: 'Chat',
    img: ChatSvg,
  },
]

 const dispatch = useDispatch()

  return (
    <View className='font-sanBold_700'>
      <View>
        <Text className='ml-4 font-sanBold_700 text-[16px] '>
          What are you delivering today?
        </Text>
      </View>
      <View className='flex  flex-row flex-wrap mx-1 my-5'>
        {items.map((item, ind) => (
          <View className={'w-1/2 p-2  '} key={ind}>
            <Pressable
              onPress={() => {
                const screen = item.screen
                if (item.screen === 'Checkout') {
                  dispatch(modifyData({ type: 'CATEGORY', data: item.name }))
                }
                navigation.navigate(item.screen)
              }}
            >
              <View className=' rounded p-2 shadow-lg bg-custom_white-400 py-5'>
                <View className='flex flex-row py-2'>
                  <item.img width={30} height={30} 
                  />
                  <Text className='ml-2 text-bold font-sanBold_500 my-auto'>
                    {item.name}
                  </Text>
                </View>
                <Text className='text-xs text-left font-sanRegular_400 mb-1'>
                  {item.description}
                </Text>
              </View>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  )
}



export default Services