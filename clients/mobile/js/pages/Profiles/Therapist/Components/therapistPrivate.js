import React from 'react'
import { editUser } from '../../../../services/user_service'
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dialog, Title, TextInput } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradientButton from '../../../../components/LinearGradientButton'
import { get_user } from '../../../../Redux/Actions/Actions'
import SnackBar from '../../../../components/SnackBar'

const TherapistPrivate = ({ therapist, privat, visibPrivat }) => {

    const user = therapist

    const dispatch = useDispatch();
    const [email, setEmail] = React.useState(user.email);
    const [mdp, setMdp] = React.useState("password");
    const [cmdp, setCmdp] = React.useState("password");
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const savePassword = async () => {
        if (mdp !== cmdp) {
            console.log('not the same !');
            return;
        }
        const params = new URLSearchParams()
        params.append('password', mdp)
        await editUser(params, true);
        visibPrivat();
    }
    const saveEmail = async () => {
        const params = new URLSearchParams()
        params.append('email', email)
        await editUser(params, true);
        dispatch(get_user(true));
        visibPrivat();
    }

    return (

        <Modal visible={privat} animationType={'slide'} transparent={true}>
            <Dialog visible={privat}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <TouchableOpacity onPress={visibPrivat}>
                        <Entypo name="cross" color={'grey'} size={35} />
                    </TouchableOpacity>
                    <Title style={{ textAlign: "center" }}>Modifier mes informations privé</Title>
                    <View style={styles.inputView}>
                        <TextInput mode="outlined" style={styles.modalinput} label="email" value={email} onChangeText={text => setEmail(text)} />
                    </View>
                    <View style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 10 }}>
                            <LinearGradientButton theme={"Therapist"} textSize={16} onPress={saveEmail} text={'Enregistrer'} />
                        </View>
                    <View style={styles.inputView}>
                        <TextInput mode="outlined" secureTextEntry={secureTextEntry ? true : false} style={styles.modalinput} label="mot de passe" value={mdp} onChangeText={text => setMdp(text)} />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput mode="outlined" secureTextEntry={secureTextEntry ? true : false} style={styles.modalinput} label="confirmer mot de passe" value={cmdp} onChangeText={text => setCmdp(text)} />
                    </View>
                    <View>
                        <View style={{ marginTop: 10, marginBottom: 15 }}>
                            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                                <LinearGradientButton theme={"Therapist"} textSize={16} onPress={savePassword } text={'Enregistrer'} />
                            </View>
                        </View>
                    </View>
                </View>
            </Dialog>
        </Modal>
    );
}

export default TherapistPrivate


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