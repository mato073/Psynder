import React, {} from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ArrowBack = props => {
    const {color} = props;

    return (
        <View style={{paddingHorizontal: 5}}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <Ionicons
                    name="arrow-back"
                    color={color}
                    size={35}
                />
            </TouchableOpacity>
        </View>
    )
}

export default ArrowBack;