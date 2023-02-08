import React, {} from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import * as Animatable from 'react-native-animatable';

import { get_role_request } from '../../Redux/Actions/Actions'

import LinearGradientButton from '../../components/LinearGradientButton'
import LinearGradientText from '../../components/LinearGradientText'

const DefaultLogin = (props) => {
    const dispatch = useDispatch();

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
            <LinearGradientText colors={['#4cc7bc', '#009387']} textSize={30} fontWeight={"bold"} text={"Bienvenue sur l'application Psynder"}/>
            </View>
            <View style={styles.logoView}>
                <Animatable.Image
                    useNativeDriver={true}
                    animation="bounceInDown"
                    source={require('../../../assets/png/logo/logo.png')}
                    style={styles.logo}
                    resizeMode="stretch"/>
            </View>
            <Animatable.View
                useNativeDriver={true}
                animation="fadeInUpBig"
                style={styles.footer}>
                <LinearGradientText colors={['#4cc7bc', '#009387']} textSize={30} fontWeight={"bold"} text={"Je suis un :"}/>
                <View style={styles.viewButtons}>
                    <LinearGradientButton theme={"User"} text={'Patient'} onPress={() => {
                        dispatch(get_role_request("User"))
                        props.navigation.navigate('Login')
                    }}/>
                </View>
                <View style={styles.viewButtons}>
                    <LinearGradientButton theme={"Therapist"} text={'Thérapeute'} onPress={() => {
                        dispatch(get_role_request("Therapist"))
                        props.navigation.navigate('Login')
                    }}/>
                </View>
            </Animatable.View>
        </View>
    );
}
  
export default DefaultLogin;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleView: {
        flex: 0.5, 
        alignItems: "center", 
        justifyContent: "center",
        paddingHorizontal: 20
    },
    logoView: {
        flex: 1,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        flex: 1,
        resizeMode: 'contain'
    },
    footer: {
        flex: 1,
        marginTop: 10,
    },
    viewButtons: {
        marginTop: 40,
        justifyContent: 'center',
        paddingHorizontal: 20
    },
});