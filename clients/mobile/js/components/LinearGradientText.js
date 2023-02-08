import React, {} from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { LinearTextGradient } from "react-native-text-gradient";

const LinearGradientText = props => {
    const {colors, text, textSize, fontWeight} = props;

    return (
        <LinearTextGradient 
            style={[styles.linearGradient, {fontSize: textSize == null ? 20 : textSize}]}
            locations={[0, 1]}
            colors={[colors[0], colors[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
                <Text style={{fontWeight: fontWeight}}>
                    {text}
                </Text>
            </LinearTextGradient>
    )
}

export default LinearGradientText;

const styles = StyleSheet.create({
    linearGradient: {
        textAlign: 'center', 
    },
});