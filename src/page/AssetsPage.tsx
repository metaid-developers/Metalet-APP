import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { metaStyles} from '../constant/Constants'
import { NoMoreDataView } from '../constant/Widget'

export default function AssetsPage() {

  const [hasData,setHasData]=useState(false)

  return (
    <View style={metaStyles.verMarginContainer}>
      
      <NoMoreDataView isShow={!hasData} />

    </View>
  )
}