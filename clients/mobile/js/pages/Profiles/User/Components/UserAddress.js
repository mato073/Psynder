import React from 'react'
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dialog, Title } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradientButton from '../../../../components/LinearGradientButton'
import TextInputAutoComplete from '../../../../components/TextInputAutoComplete'
import { post_location } from '../../../../services/location_service'
import { get_location_request } from '../../../../Redux/Actions/Actions';

const UserAddress = ({ localization, visibAd, visiblAddres }) => {

    const dispatch = useDispatch();
    const [autoCompleteText, setAutoCompleteText] = React.useState('');
    const [location, setAutoCompleteLocationData] = React.useState({
        address: '',
        lat: null,
        lng: null
    });
    const save = async () => {
        if (localization === null)
            await post_location("POST", false, location.lat, location.lng, location.address)
        else
            await post_location("PATCH", false, location.lat, location.lng, location.address)
        visiblAddres();
        /* dispatch(get_location_request(false)); */
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
                            <LinearGradientButton textSize={16} theme={"User"} onPress={save} text={'Enregistrer'} />
                        </View>
                    </View>
                </View>
            </Dialog>
        </Modal>
    );
}

export default UserAddress

const styles = StyleSheet.create({
    inputView: {
        margin: 10,
    }
})