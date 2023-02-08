import React from 'react'
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import LinearGradientButton from '../../../components/LinearGradientButton'

const NoTherapistView = (props) => {
    const {setNoTherapistViewVisible, getTherapistCloseToUser, 
        distanceRadius} = props

    return (
        <View style={{width: '100%', position: 'absolute', bottom: '40%', zIndex: 1}}>
            <View style={{marginHorizontal: 10, paddingBottom: 5, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 10}}>
                <Text style={{textAlign: "center", fontWeight: "bold", color: "#009387", fontSize: 28}}>Aucun thérapeute à proximité</Text>
                <Text style={{textAlign: "center", fontWeight: "bold", color: "#555555", fontSize: 16}}>Vérifiez votre connexion, relancez une recherche ou agrandisez votre distance de recherche</Text>
            </View> 
            <View style={{marginHorizontal: 20, marginTop: 10}}>
                <LinearGradientButton 
                    theme={"User"}
                    textSize={15}
                    onPress={() => {
                        setNoTherapistViewVisible(false)
                        getTherapistCloseToUser(distanceRadius)
                    }}
                    text={"Relancer une recherche"}/>
            </View>
        </View>
    )
}

export default NoTherapistView