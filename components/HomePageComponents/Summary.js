import { View, Text, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import * as Icon  from 'react-native-feather'
const Summary = () => {
 const data =[
   {
     title:'Total Earnings',
     value:'TZS 0.00',
     step:'View',
     screen:''
   },
   {
     title:'Outstanding Charges',
     value:'TZS 0.00',
     step:'Pay',
     screen:''
   },

 ]
 const [hideDetails, setHideDetails] = useState(true)
  return (
    <View>
      <View className='flex flex-row justify-between'>
        <Text className='ml-4 font-sanBold_700'>View Summary</Text>
        {hideDetails ? (
          <Icon.EyeOff
            onPress={() => setHideDetails(!hideDetails)}
            className='mr-5 text-custom_orange-500'
            width={20}
            height={20}
          />
        ) : (
          <Icon.Eye
            onPress={() => setHideDetails(!hideDetails)}
            className='mr-5 text-custom_orange-500'
            width={20}
            height={20}
          />
        )}
      </View>
      <View className='flex flex-row m-3'>
        {data.map((item, ind) => (
          <View className='w-1/2 p-2 ' key={ind}>
            <View className=' rounded p-2 shadow-lg bg-custom_white-400'>
              <Text className='text-bold font-sanBold_500 my-2'>
                {item.title}
              </Text>
              <View className='w-full flex-row justify-between'>
                <Text className='text-xs my-auto text-left font-sanRegular_400 mb-1'>
                  {hideDetails ? '*********' : item.value}
                </Text>
                <TouchableOpacity className='px-1 mb-1 mr-2 my-auto  rounded border-custom_orange-500 border  opacity-75'>
                 <Text className='text-center opacity-100'>{item.step}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default Summary