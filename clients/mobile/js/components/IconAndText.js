import React, {} from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const IconAndText = (props) => {
    const {text, textSize, fontWeight, icon, marginVertical} = props;

    return (
        <View style={{flex: 1, flexDirection: "row", alignItems: "center", marginTop: marginVertical != null ? marginVertical: 0}}>
            <View style={{flex: textSize != null ? textSize / 100 : 0.15, alignItems: "center"}}>
                {icon}
            </View>
            <View style={{flex: 1}}>
            <Text 
                style={{
                    fontSize: textSize != null ? textSize : 15, 
                    fontWeight: fontWeight != null ? fontWeight : "normal"
                }}>
                {text}
            </Text>
            </View>
        </View>
    )
}

export default IconAndText;