import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Easing } from 'react-native'

import Home from '../screens/Home'
import Introduction from '../screens/Introduction'
import Checkout from '../screens/Checkout'
import MajorMap from '../screens/MajorMap'
import Confirmation from '../screens/Confirmation'
import DeliveryConfirmed from '../screens/DeliveryConfirmed'
import ChangePassword from '../screens/settings/DetailsEdit/ChangePassword'
import EditProfile from '../screens/settings/DetailsEdit/EditProfile'
import AcceptDeliveries from '../screens/AcceptDeliveries'
import InstantDetails from '../screens/InstantDetails'
import ManageDeliveries from '../screens/ManageDeliveries'

import {
  About,
  Terms,
  Language,
  Profile,
  LocationID,
  Help,
  BeDriver,
  RefundPolicy,
  LiveSupport,
  Share,
  SavedAddress,
} from '../screens/settings'


import HomeTabs from '../components/HomePageComponents/HomeTabs'
const Stack = createNativeStackNavigator()
export default function AuthNavigation() {


  return (
    <Stack.Navigator
      initialRouteName={'Introduction'}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Group>
        <Stack.Screen name='Introduction' component={Introduction} />
        <Stack.Screen name='Home' component={HomeTabs} />
        <Stack.Screen name='AcceptDeliveries' component={AcceptDeliveries} />
        <Stack.Screen name='Checkout' component={Checkout} />
        <Stack.Screen name='MajorMap' component={MajorMap} />
        <Stack.Screen name='Confirmation' component={Confirmation} />
        <Stack.Screen name='DeliveryConfirmed' component={DeliveryConfirmed}/>
        <Stack.Screen name='InstantDetails' component={InstantDetails}/>
        <Stack.Screen name='ManageDeliveries' component={ManageDeliveries}/>
        
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name='About' component={About} />
        <Stack.Screen name='Terms' component={Terms} />
        <Stack.Screen name='Language' component={Language} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='LocationID' component={LocationID} />
        <Stack.Screen name='Help' component={Help} />
        <Stack.Screen name='BeDriver' component={BeDriver} />
        <Stack.Screen name='RefundPolicy' component={RefundPolicy} />
        <Stack.Screen name='LiveSupport' component={LiveSupport} />
        <Stack.Screen name='Share' component={Share} />
        <Stack.Screen name='SavedAddress' component={SavedAddress} />


      </Stack.Group>
      <Stack.Group>
      <Stack.Screen name='ChangePassword' component={ChangePassword} />
      <Stack.Screen name='EditProfile' component={EditProfile} />

      </Stack.Group>
    </Stack.Navigator>
  )
}
