import React from 'react'
import { View, ScrollView } from 'react-native';

import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import LinearGradientButton from '../../../components/LinearGradientButton'

const TopButtons = (props) => {
    const {setSearchOptionModalVisible, setOneTherapistInfo,
        setAllTherapistInfo, therapistList} = props

    return (
        <View style={{position: "absolute", top: 10, flexDirection: "row"}}>
            <ScrollView 
                horizontal
                style={{paddingHorizontal: 10}}
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}>
                <View style={{marginRight: 5}}>
                    <LinearGradientButton 
                        theme={"User"}
                        textSize={15}
                        onPress={() => {
                            setSearchOptionModalVisible(true)
                        }}
                        icon={<FontAwesome5 name="search" color={'white'} size={18}/>}
                        text={"Options de recherche"}/>
                </View>
                <View style={{marginLeft: 5, marginRight: 20}}>
                    <LinearGradientButton
                        theme={"User"}
                        textSize={15}
                        onPress={() => {
                            if (therapistList.length > 0) {
                                setOneTherapistInfo(false);
                                setAllTherapistInfo(true);
                            }
                        }}
                        icon={<Fontisto name="doctor" color={'white'} size={18}/>}
                        text={"Liste des thérapeutes"}/>
                </View>
            </ScrollView>
        </View>
    )
}

export default TopButtons