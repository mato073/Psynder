import React, {} from 'react';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from '@react-navigation/native';

const GetIcons = props => {

    const { name, iconName } = props;
    const { colors } = useTheme();

    if (name === "FontAwesome5")
        return (
            <FontAwesome5 name={iconName} color={colors.text} size={20}/>
        )
    else if (name === "Feather")
        return (
            <Feather name={iconName} color={colors.text} size={20}/>
        )
}

export default GetIcons;