import { View, Text,TextInput} from 'react-native'
import React from 'react'
import {navigate} from '../base/NavigationService'
import { metaStyles } from '../constant/Constants'

export default function HomePage(props:any) {
  return (
    <View style={metaStyles.container}>
       <TextInput
          placeholder="Enter your mnemonic phrase or private key"
          placeholderTextColor="#999"
        />
      <Text onPress={()=>props.navigation.navigate('WelcomeWalletPage')}>HomePage</Text>
      {/* <Text onPress={()=>navigate('WelcomeWalletPage')}>HomePage</Text> */}
    </View>
  )
}