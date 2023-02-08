import React from 'react'
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dialog, Title } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradientButton from '../../../../components/LinearGradientButton'
import TextInputAutoComplete from '../../../../components/TextInputAutoComplete'
import { post_location } from '../../../../services/location_service'
import { get_location } from '../../../../Redux/Actions/Actions'

const TherapistAddres = ({ localization, visibAd, visiblAddres }) => {

    const dispatch = useDispatch();
    const [autoCompleteText, setAutoCompleteText] = React.useState('');
    const [location, setAutoCompleteLocationData] = React.useState({
        address: '',
        lat: null,
        lng: null
    });
    const save = async () => {
         if (localization === "") {
            await post_location("POST", true, location.lat, location.lng, location.address)
        } else if (localization !== "") {
            await post_location("PATCH", true, location.lat, location.lng, location.address)
        }
        visiblAddres();
        dispatch(get_location(true))
    }
    return (
        <Modal visible={visibAd} animationType={'slide'} transparent={true}>
            <Dialog visible={visibAd}>
                <View style={{ display: 'flex', flexDirection: 'column', margin: 15 }}>
                    <View>
                        <TouchableOpacity onPress={() => visiblAddres()}>
                            <Entypo name="cross" color={'grey'} size={35} />
                        </TouchableOpacity>
                    </View>
                    <Title style={{ textAlign: "center" }}>Modifier mon adresse</Title>
                    <View style={styles.inputView}>
                        <TextInputAutoComplete placeholder={"Adresse"} autoCompleteText={autoCompleteText} setAutoCompleteText={(text) => setAutoCompleteText(text)} setAutoCompleteLocationData={(locationData) => setAutoCompleteLocationData(locationData)} />
                    </View>
                    <View style={{ marginTop: 10, marginBottom: 15 }}>
                        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                            <LinearGradientButton textSize={16} theme={"Therapist"} onPress={save} text={'Enregistrer'} />
                        </View>
                    </View>
                </View>
            </Dialog>
        </Modal>
    );
}

export default TherapistAddres


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