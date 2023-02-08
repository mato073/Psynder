import * as React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Title, Dialog } from 'react-native-paper';
import { editUser } from '../../../../services/user_service'
/* import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; */

import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradientButton from '../../../../components/LinearGradientButton'
import SnackBar from '../../../../components/SnackBar'
import { get_user_data_request } from '../../../../Redux/Actions/Actions';
import { useDispatch } from 'react-redux';


const UserPrivate = ({ userinfos, privat, visibPrivat }) => {

    const user = userinfos
    const [email, setEmail] = React.useState(user.email);
    const [mdp, setMdp] = React.useState("password");
    const [cmdp, setCmdp] = React.useState("password");
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const dispatch = useDispatch();

    const savePassword = async () => {
        if (mdp !== cmdp) {
            console.log('not the same !');
            return;
        }
        const params = new URLSearchParams()
        params.append('password', mdp)
        await editUser(params, false);
        visibPrivat();
    }
    const saveEmail = async () => {
        const params = new URLSearchParams()
        params.append('email', email)
        await editUser(params, false);
        dispatch(get_user_data_request(false));
        visibPrivat();
    }


    return (
        <Modal visible={privat} animationType={'slide'} transparent={true}>
            <Dialog visible={privat}>
                <ScrollView>
                    {/* <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} enableOnAndroid={true}> */}
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <TouchableOpacity onPress={() => visibPrivat()}>
                            <Entypo name="cross" color={'grey'} size={35} />
                        </TouchableOpacity>
                        <Title style={{ textAlign: "center" }}>Modifier mes informations privé</Title>
                        <View style={styles.inputView}>
                            <TextInput mode="outlined" style={styles.modalinput} label="email" value={email} onChangeText={text => setEmail(text)} />
                        </View>
                        <View style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 10 }}>
                            <LinearGradientButton theme={"User"} textSize={16} onPress={saveEmail} text={'Enregistrer'} />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput mode="outlined" secureTextEntry={secureTextEntry ? true : false} style={styles.modalinput} label="mot de passe" value={mdp} onChangeText={text => setMdp(text)} />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput mode="outlined" secureTextEntry={secureTextEntry ? true : false} style={styles.modalinput} label="confirmer mot de passe" value={cmdp} onChangeText={text => setCmdp(text)} />
                        </View>
                        <View style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 10 }}>
                            <LinearGradientButton theme={"User"}textSize={16} onPress={savePassword} text={'Enregistrer'} />
                        </View>
                    </View>
                    {/* </KeyboardAwareScrollView> */}
                </ScrollView>
            </Dialog>
        </Modal>
    );
}

export default UserPrivate

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    infos: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 15,
        marginLeft: 5,
        marginRight: 5,
        borderBottomEndRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#30C1DD',
        shadowRadius: 10,
        shadowOpacity: 0.6,
        elevation: 8,
        shadowOffset: {
            width: 0,
            height: 4
        }
    },
    data: {
        display: 'flex',
        flexDirection: 'row',
        margin: 5
    },
    test: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    avatar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    modalinput: {
        //backgroundColor: 'white'
    },
    inputView: {
        margin: 10,
    },
    modalView: {
        position: 'absolute',
        width: '90%',
        height: '80%',
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        borderBottomEndRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
    },
    textColor: {
        color: 'black'
    }
})