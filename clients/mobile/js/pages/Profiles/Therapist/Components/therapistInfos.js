import React from 'react'
import { editUser } from '../../../../services/user_service'
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dialog, Title, TextInput } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradientButton from '../../../../components/LinearGradientButton'
import { get_user } from '../../../../Redux/Actions/Actions'

const TherapistInfos = ({ therapist, visib, visibleModal}) => {

    const user = therapist

    const dispatch = useDispatch();
    const [nom, setNom] = React.useState(user.lastName);
    const [firstName, setFirstName] = React.useState(user.firstName);
    const [number, setNumber] = React.useState(user.phoneNumber);

    const save = async () => {

        const params = new URLSearchParams()
        params.append('firstName', firstName,)
        params.append('lastName', nom)
        params.append('phoneNumber', number)

        await editUser(params, true);
        dispatch(get_user(true));
        visibleModal();

    }
    return (
        <Modal visible={visib} animationType={'slide'} transparent={true}>
            <Dialog visible={visib}>
                <View style={{ display: 'flex', flexDirection: 'column', margin: 15 }}>
                    <View>
                        <TouchableOpacity onPress={() => visibleModal()}>
                            <Entypo name="cross" color={'grey'} size={35} />
                        </TouchableOpacity>
                    </View>
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
                    <View style={{ marginTop: 10, marginBottom: 15 }}>
                        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                            <LinearGradientButton textSize={16} theme={"Therapist"} onPress={save} text={'Enregistrer'}/>
                        </View>
                    </View>
                </View>
            </Dialog>
        </Modal>
    );
}

export default TherapistInfos


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 20
    },
    infos: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
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
    data2: {
        display: 'flex',
        flexDirection: 'row',
        margin: 5,
        flexWrap: 'wrap'
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
    listItem: {
        backgroundColor: '#B8B8B8',
        margin: 2
    },
    inputView: {
        margin: 10,
    },
    fab: {
        position: 'absolute',
        marginRight: 10,
        right: 0,
        bottom: 0,
        backgroundColor: '#1797e8'
    },
})