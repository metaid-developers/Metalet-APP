import { View, Text ,Image} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RoundSimButton, TitleBar } from "../constant/Widget";
import { metaStyles } from "../constant/Constants";
import {navigate} from '../base/NavigationService'

export default function CongratulationsPage({ route ,props}) {
  const { type } = route.params;

  return (
    <SafeAreaView style={metaStyles.parentContainer}>
      <TitleBar />
      <View style={metaStyles.centerContainer}>
       <Image source={require("../../image/meta_congratulations_icon.png") } style={{width: 200, height: 200,marginTop: 50}} />

        <Text style={[metaStyles.largeDefaultText,{marginTop: 20}]}>{type}</Text>
        <Text style={[metaStyles.defaultText,{marginTop: 20}]}>Now you can explore 90+ public chain crypto wallets</Text>

        <View style={{flex:1}}/>


      <RoundSimButton title="Start Metalet" textColor="#fff" event={() => {
        navigate("Tabs");
      }} />

      </View>

    </SafeAreaView>
  );
}
