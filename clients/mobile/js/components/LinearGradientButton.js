import React, {} from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import LinearGradient from 'react-native-linear-gradient';

const LinearGradientButton = props => {
    const {theme, text, textSize, onPress, icon} = props;

    const ButtonColor = () => {
        if (theme === "User")
            return (['#4cc7bc', '#009387'])
        if (theme === "Therapist")
            return (['#1797e8', '#55b4f2'])
        if (theme === "Blue")
            return (['#2c70af', '#3270ab'])
        if (theme === "Purple")
            return (['#8B9AEC', '#96a3eb'])
        if (theme === "Red")
            return (['#ff5252', '#ff6161'])
        if (theme === "Grey")
            return (['#a3a3a3', '#9c9c9c'])
    }

    return (
        <LinearGradient colors={ButtonColor()}
            style={{borderRadius: 10, elevation: 3}} 
            start={{y: 0.0, x: 0.0}} end={{y: 1.0, x: 1}}>
            <Button style={styles.button} color={"transparent"} onPress={onPress}>
                {icon}
                {icon != null
                && 
                    <View>
                        <Text style={[styles.text, {fontSize: 10}]}>o</Text>
                    </View>
                }
                <Text style={[styles.text, {fontSize: textSize == null ? 20 : textSize}]}>{text}</Text>
            </Button>
        </LinearGradient>
    )
}

export default LinearGradientButton;

const styles = StyleSheet.create({
    button: {
        borderRadius: 10
    },
    text: {
        fontWeight: "bold", 
        color: "white"
    }
});