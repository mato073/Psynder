import React, {} from 'react';
import { View, Text } from 'react-native';
import LinearGradient from "react-native-linear-gradient";

const HeaderLinearGradient = () => {
  return (
    <View style={{top: 0, position: "absolute", backgroundColor: "red",
    shadowRadius: 4.65,
    shadowColor: "#555555",
    shadowOpacity: 0.29,
    shadowOffset: {
      width: 0,
      height: 3
    }}}>
         <LinearGradient
         gradient={true}
         end={{x: 1, y: 0}}
         start={{ x: 0, y: 0 }}
         //shapeColor={"#ba75df"}
         colors={["#12c2e9", "#c471ed", "#f64f59"]}
        /* start={start}
        end={end}
        colors={gradientColors} */
        //style={[styles.main, styles.customShadowStyle, _position(position)]}
      />
        <Text>ok</Text>
    </View>
  )
}

export default HeaderLinearGradient;