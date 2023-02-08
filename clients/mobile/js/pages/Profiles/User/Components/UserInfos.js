import * as React from 'react';
import { StyleSheet, View,  Modal, TouchableOpacity } from 'react-native';
import { TextInput, Title, Dialog } from 'react-native-paper';
import { editUser } from '../../../../services/user_service'

import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradientButton from '../../../../components/LinearGradientButton'
import { get_user_data_request } from '../../../../Redux/Actions/Actions';

import { useDispatch } from 'react-redux';

const UserInfos = ({userinfos, visib, visibleModal}) => {

    const user = userinfos
    const dispatch = useDispatch();
    const [nom, setNom] = React.useState(user.lastName);
    const [firstName, setFirstName] = React.useState(user.firstName);
    const [number, setNumber] = React.useState(user.phoneNumber);

    const save = async () => {
        const params = new URLSearchParams()
        params.append('firstName', firstName,)
        params.append('lastName', nom)
        params.append('phoneNumber', number)

        await editUser(params);
        dispatch(get_user_data_request(false));
        visibleModal();
    }

    return (
        <Modal visible={visib} animationType={'slide'} transparent={true}>
            <Dialog visible={visib}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <TouchableOpacity onPress={() => visibleModal()}>
                        <Entypo name="cross" color={'grey'} size={35} />
                    </TouchableOpacity>
                    <Title style={{ textAlign: "center" }}>Modifier mes informations</Title>
                    <View style={styles.inputView}>
                        <TextInput mode="outlined" style={styles.modalinput} label="Nom" value={nom} onChangeText={text => setNom(text)} />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput mode="outlined" style={styles.modalinput} label="Prénom" value={firstName} onChangeText={text => setFirstName(text)} />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput mode="outlined" style={styles.modalinput} label="Numéro" value={number} onChangeText={text => setNumber(text)} />
                    </View>
                    <View style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 10 }}>
                        <LinearGradientButton theme={"User"} textSize={16} onPress={save} text={'Enregistrer'} />
                    </View>
                </View>
            </Dialog>
        </Modal>
    );
}

export default UserInfos

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