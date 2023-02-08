import React from 'react';
import { View, Text } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { get_online_request } from '../Redux/Actions/Actions';
import { connect } from 'react-redux';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { getTheme } from '../Redux/Saga/selectors/selector';

export const UseNetInfo = (props) => {
  NetInfo.addEventListener((state) => {
    props.dispatch(get_online_request(state.isConnected));
  })
}

const Offline = (props) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <MaterialIcons name="wifi-off" color={props.theme.data === 'light' ? '#555555' : '#fff'} size={200}/>
      <Text style={{
        marginTop: 25,
        marginBottom: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#f44336',
        fontSize: 25
      }}>Vous êtes Hors-Ligne</Text>
      <FontAwesome name="warning" color="#f44336" size={100}/>
      <Text style={{
        marginTop: 25,
        color: props.theme === 'light' ? '#555555' : '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 19
      }}>(Ce message se fermera automatiquement)</Text>
  </View>
  )
}

const mapStateToProps = (state) => ({
  theme: getTheme(state)
});

export default connect(mapStateToProps)(Offline);