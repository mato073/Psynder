import React, { } from 'react';
import { View, Text } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { useTheme } from '@react-navigation/native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import LinearGradientButton from '../components/LinearGradientButton'
import { getUserRole } from '../Redux/Saga/selectors/selector';
import { logOut } from '../Redux/Actions/Actions'


const Error = props => {
    const { reloadData } = props;

    const { colors } = useTheme()

    const logoutUser = () => {
        props.dispatch(logOut())
    }

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 25}}>
                <Text style={{
                    marginBottom: 10,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#f44336',
                    fontSize: 25
                }}>Une erreur est survenue</Text>
                <MaterialIcons name="error" color="#f44336" size={80}/>
                <View style={{marginHorizontal: 20, marginTop: 20, alignSelf: 'stretch'}}>
                    <LinearGradientButton
                        theme={"Grey"}
                        text={'Recharger les données'}
                        textSize={16}
                        onPress={() => reloadData()}/>
                </View>
                <Text style={{
                    marginTop: 50,
                    marginBottom: 20,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: colors.text,
                    fontSize: 20
                }}>Si le problème persiste essayez de vous déconnecter puis de vous reconnecter</Text>
                <View style={{marginHorizontal: 20, alignSelf: 'stretch'}}>
                    <LinearGradientButton theme={"Grey"} textSize={13} onPress={logoutUser} text={'Déconnexion'} />
                </View>
                <Text style={{
                    marginTop: 50,
                    marginBottom: 20,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: colors.text,
                    fontSize: 20
                }}>Sinon contactez le support</Text>
                <View style={{marginHorizontal: 20, alignSelf: 'stretch'}}>
                    <LinearGradientButton
                        theme={props.role.data}
                        text={'beta.psynder@gmail.com'}
                        textSize={13}
                        onPress={() => Linking.openURL('mailto:beta.psynder@gmail.com?subject=Support')}/>
                </View>
            </View>
        </View>
    )
}

const mapStateToProps = (state) => ({
    role: getUserRole(state),
});
  
export default connect(mapStateToProps)(Error);