import React, {} from 'react'
import { View, Linking } from 'react-native';
import { connect } from 'react-redux';
import { Text } from 'react-native-paper';

import LinearGradientButton from '../../components/LinearGradientButton'
import { getUserRole } from '../../Redux/Saga/selectors/selector';

const Support = (props) => {
    return (
        <View style={{marginHorizontal: 20, flex: 1}}>
            <View style={{marginBottom: 25}}>
                <Text style={{fontSize: 22, fontWeight: "bold", marginBottom: 15}}>Support</Text>
                <Text style={{fontSize: 16, marginBottom: 10}}>Répondre au google form</Text>
                <LinearGradientButton
                    theme={props.role.data}
                    text={'Google form'}
                    textSize={13}
                    onPress={() => Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSdChZ5AfTVI9egEedxmUcsFidqOFLUfSzsayx7tmRKTcgmpCw/viewform?usp=sf_link')}/>
            </View>
            <View style={{marginBottom: 10}}>
                <Text style={{fontSize: 16, marginBottom: 10}}>Envoyer un mail au support</Text>
                <LinearGradientButton
                    theme={props.role.data}
                    text={'beta.psynder@gmail.com'}
                    textSize={13}
                    onPress={() => Linking.openURL('mailto:beta.psynder@gmail.com?subject=Support')}/>
            </View>
        </View>
    )
}

const mapStateToProps = (state) => ({
    role: getUserRole(state),
});
  
export default connect(mapStateToProps)(Support);