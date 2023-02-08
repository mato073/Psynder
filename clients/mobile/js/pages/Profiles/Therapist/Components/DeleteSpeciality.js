import React from 'react'
import { View, Modal, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dialog, Title } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradientButton from '../../../../components/LinearGradientButton'
import { get_user } from '../../../../Redux/Actions/Actions'
import { delete_therapists_speciality} from '../../../../services/speciality_service'

const DeleteSpeciality = ({ page4, setPage4, item }) => {
    const dispatch = useDispatch();
    const deleteSpe = async (id) => {
        let result;
        result = await delete_therapists_speciality(id);
        dispatch(get_user(true))
        setPage4(false);
    }

    return (
        <Modal visible={page4} animationType={'slide'} transparent={true}>
            <Dialog visible={page4}>
                <View>
                    <TouchableOpacity onPress={() => setPage4(false)}>
                        <Entypo name="cross" color={'grey'} size={35} />
                    </TouchableOpacity>
                </View>
                {item && (<View style={{ padding: 10 }}>
                    <View>
                        <Title>Nom</Title>
                        <Text>
                            {item.name.replace(/(\r\n|\n|\r)/gm, " ")}
                        </Text>
                    </View>
                    <View>
                        <Title>Acronyme</Title>
                        <Text>
                            {item.acronym}
                        </Text>
                    </View>
                    <View>
                        <Title>Description</Title>
                        <Text>
                            {item.description}
                        </Text>
                    </View>
                </View>)}
                <View style={{ marginTop: 10, marginBottom: 15 }}>
                    <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                        <LinearGradientButton theme={"Red"} textSize={16} onPress={() => deleteSpe(item._id)} text={'Supprimer'} />
                    </View>
                </View>
            </Dialog>
        </Modal>
    );
}

export default DeleteSpeciality

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