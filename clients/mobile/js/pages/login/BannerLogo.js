import React, {} from 'react';
import * as Animatable from 'react-native-animatable';
import { StyleSheet, View } from 'react-native';

import LinearGradientText from '../../components/LinearGradientText'

const BannerLogo = props => {
  const {colors, text} = props;

  return (
    <View style={styles.header}>
       {/*  <Animatable.Image
            animation="bounceInDown"
            source={require('../../../assets/png/logo/logo.png')}
            style={styles.logo}
            resizeMode="stretch"
        /> */}
        {text === 'Connexion'
        &&
            <Animatable.View useNativeDriver={true} animation="bounceInDown">
                <LinearGradientText colors={[colors[0], colors[1]]} textSize={50} fontWeight={"bold"} text={text}/>
            </Animatable.View>
        }
        {text === 'Inscription'
        &&
            <Animatable.View useNativeDriver={true} animation="bounceInDown">
                <LinearGradientText colors={[colors[0], colors[1]]} textSize={50} fontWeight={"bold"} text={text}/>
            </Animatable.View>
        }
    </View>
  )
}

export default BannerLogo;

const styles = StyleSheet.create({
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    logo: {
        width: 100,
        height: 100,
    }
});
