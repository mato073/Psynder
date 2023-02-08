import React from 'react'
import { View, Text, Linking } from 'react-native'
import { version } from '../../package.json';
import axios from 'axios';
import { BASE_URL } from '@env';
import { get_version_request } from '../Redux/Actions/Actions';
import { useTheme } from '@react-navigation/native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import LinearGradientButton from '../components/LinearGradientButton'

const base_url = BASE_URL;

export async function CheckVersion(props) {
    const url = `${base_url}/mobile-app-version`;
    const result = await axios.get(url);;

    if (result.data.version === version)
        props.dispatch(get_version_request(true));
    else 
        props.dispatch(get_version_request(false));
}

const NewVersion = () => {
    const { colors } = useTheme()

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{
                marginTop: 20,
                marginBottom: 20,
                textAlign: 'center',
                fontWeight: 'bold',
                color: colors.text,
                fontSize: 25
            }}>Une nouvelle version de l'application est disponible</Text>
            <FontAwesome name="cloud-download" color={colors.icon} size={100}/>
            <View style={{marginTop: 15}}>
                <LinearGradientButton theme={"Blue"} text={'Installer'} 
                    icon={<Feather name="download" color={'white'} size={20}/>}
                    onPress={() => Linking.openURL('http://psynder.fr/download')}/>
            </View>
        </View>
    )
}

export default NewVersion
