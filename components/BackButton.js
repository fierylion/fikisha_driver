import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { ArrowLeft } from 'react-native-feather'
import { useNavigation } from '@react-navigation/native'
const BackButton = () => {
  const navigation = useNavigation()
  return (
    <View className='absolute top-3 left-3 z-10 rounded-full bg-[#ffffff]  shadow hover:opacity-70'>
      <Pressable
        onPress={() => {
          navigation.goBack()
        }}
        className='w-10 h-10 '
      >
        <ArrowLeft className='w-10 h-10 text-custom_black-100 m-auto  ' />
      </Pressable>
    </View>
  )
}

export default BackButton