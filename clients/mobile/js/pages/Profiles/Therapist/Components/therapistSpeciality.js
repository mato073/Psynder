import React from 'react'
import { View, Modal, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dialog, Title, TextInput, Searchbar, FAB, Divider, Text } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradientButton from '../../../../components/LinearGradientButton'
import { get_user } from '../../../../Redux/Actions/Actions'
import { post_therapists_specialty, post_speciality } from '../../../../services/speciality_service'
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';

const TherapistSpecialty = ({ visibSpe, visibleSpe, tempSpecialty, setTempSpecialty, allspecialt, token }) => {

    const [searchQuery, setSearchQuery] = React.useState('');
    const [name, setName] = React.useState("");
    const [acronym, setAcronym] = React.useState("");
    const [description, setDescription] = React.useState("")
    const [page, setPage] = React.useState('page1');
    const [item, setItem] = React.useState();

    const dispatch = useDispatch();

    const newSpecialty = async () => {
        let result;

        result = await post_speciality(token, name, acronym, description);
        await addSpecialty(true, result.specialtyId)
        dispatch(get_user(token, true))
    }
    const contains = ({ acronym, name, }, query) => {

        if (acronym.toLowerCase().includes(query) || name.toLowerCase().includes(query)) {
            return true;
        }

        return false;
    };

    const addSpecialty = async (newSpe, id) => {
        if (newSpe)
            await post_therapists_specialty(token, id);
        else
            await post_therapists_specialty(token, item.id);
        dispatch(get_user(true))
        visibleSpe();
    }

    const add_page = (name, id, acronym, description) => {
        setPage('page2');
        setItem({ 'name': name, 'id': id, 'acronym': acronym, 'description': description });
    }

    const Item = ({ name, id, acronym, description, key }) => (
        <View key={key} style={{ padding: 5, margin: 2, backgroundColor: "white" }}>
            <Divider />
            <TouchableOpacity onPress={() => add_page(name, id, acronym, description)}>
                <Text>{name.replace(/(\r\n|\n|\r)/gm, " ")} </Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }) => (
        <Item key={item.id} name={item.name} id={item._id} acronym={item.acronym} description={item.description} />
    );

    const handelSearch = (text) => {
        const formatQuery = text.toLowerCase();
        const data = _.filter(allspecialt, specialty => {
            return (contains(specialty, formatQuery));
        })
        setSearchQuery(formatQuery);
        setTempSpecialty(data);
    }

    <View>
        <Text>test</Text>
    </View>

    if (page === 'page1') {
        return (
            <Modal visible={visibSpe} animationType={'slide'} transparent={true}>
                <Dialog visible={visibSpe}>
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <View>
                            <View
                                style={{
                                    padding: 5,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <TouchableOpacity onPress={() => visibleSpe()} >
                                    <Entypo name="cross" color={'grey'} size={35} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ display: 'flex', backgroundColor: 'white', }}>
                                <Searchbar style={{ marginLeft: 7, marginRight: 7, marginBottom: 5 }}
                                    placeholder="Spécialité"
                                    onChangeText={handelSearch}
                                    value={searchQuery}
                                />
                            </View>
                            <SafeAreaView>
                                <FlatList
                                    data={tempSpecialty}
                                    renderItem={renderItem}
                                    keyExtractor={item => item._id}
                                />
                                <View style={{ marginTop: 20, marginBottom: 10 }}>
                                    <FAB
                                        style={styles.fab}
                                        small
                                        icon="plus"
                                        onPress={() => setPage('page3')}
                                    />
                                </View>
                            </SafeAreaView>
                        </View>
                    </View>
                </Dialog>
            </Modal>
        );
    } else if (page === 'page2') {
        return (

            <Modal visible={visibSpe} animationType={'slide'} transparent={true}>
                <Dialog visible={visibSpe}>
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <View>
                            <View
                                style={{
                                    padding: 5,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <TouchableOpacity
                                    onPress={() => setPage('page1')}>
                                    <Ionicons name="arrow-back" color={"#009387"} size={35} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ padding: 10 }}>
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
                            </View>
                            <View style={{ marginTop: 10, marginBottom: 15 }}>
                                <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                                    <LinearGradientButton textSize={16} theme={"Therapist"} onPress={() => addSpecialty()} text={'Ajouter'} />
                                </View>
                            </View>
                        </View>
                    </View>
                </Dialog>
            </Modal>
        );

    } else if (page === 'page3') {
        return (
            <Modal visible={visibSpe} animationType={'slide'} transparent={true}>
                <Dialog visible={visibSpe}>
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <View>
                            <View
                                style={{
                                    padding: 5,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <TouchableOpacity
                                    onPress={() => setPage('page1')}>
                                    <Ionicons name="arrow-back" color={'#1797e8'} size={35} />
                                </TouchableOpacity>
                            </View>
                            <Title style={{ textAlign: 'center' }} >Créer une nouvelle spécialité</Title>
                            <View style={{ padding: 10 }}>
                                <View>
                                    <TextInput mode="outlined" theme={styles.input} style={styles.modalinput} label="Nom" value={name} onChangeText={text => setName(text)} />
                                </View>
                                <View>
                                    <TextInput mode="outlined" style={styles.modalinput} label="Acronyme" value={acronym} onChangeText={text => setAcronym(text)} />
                                </View>
                                <View>
                                    <TextInput mode="outlined" style={styles.modalinput} label="Déscription" value={description} onChangeText={text => setDescription(text)} />
                                </View>
                            </View>
                            <View style={{ marginTop: 10, marginBottom: 15 }}>

                                <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                                    <LinearGradientButton textSize={16} theme={"Therapist"} onPress={() => newSpecialty()} text={'Créer'} />
                                </View>
                            </View>
                        </View>
                    </View>
                </Dialog>
            </Modal>
        );
    }
    else if (page === 'page4') {
        return (
            <Modal visible={visibSpe} animationType={'slide'} transparent={true}>
                <Dialog visible={visibSpe}>
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <View>
                            <View
                                style={{
                                    padding: 5,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <TouchableOpacity onPress={visibleSpe(), setPage('page1')}>
                                    <Entypo name="cross" color={'grey'} size={35} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ padding: 10 }}>
                                <View>
                                    <Title>Nom</Title>
                                    <Text>
                                        {item.name}
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
                            </View>
                            <View style={{ marginTop: 10, marginBottom: 15 }}>
                                <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                                    <LinearGradientButton textSize={16} theme={"Therapist"} onPress={() => addSpecialty()} text={'Ajouter'} />
                                </View>
                            </View>
                        </View>
                    </View>
                </Dialog>
            </Modal>
        );
    }
}

export default TherapistSpecialty


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