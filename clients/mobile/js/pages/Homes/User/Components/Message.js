import React from 'react';
import {
    View,
    StyleSheet,
    Modal,
    TouchableOpacity,
} from 'react-native';
import {
    Button,
    Title,
    Text,
} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';


const Message = ({ visible, setVisible, goTosurvey }) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            animationType={'slide'}
            transparent={true}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'black',
                        opacity: 0.6,
                    }}
                />
                <View style={styles.modalView}>
                    <View
                        style={{
                            padding: 5,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <Entypo name="cross" color={'grey'} size={35} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Title
                            style={{
                                textAlign: 'center',
                                justifyContent: 'center',
                                color: '#009387',
                                fontWeight: 'bold',
                                fontSize: 30,
                                marginTop: 20,
                            }}>
                            Bienvenue sur l'application Psynder
              </Title>
                    </View>
                    <View>
                        <Text
                            style={{
                                color: 'black',
                                textAlign: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: 20,
                                marginVertical: 40,
                            }}>
                            Voulez vous commencer le questionnaire ?
              </Text>
                    </View>
                    <View style={{ padding: 20 }}>
                        <Button
                            onPress={() => goTosurvey()}
                            color="white"
                            style={{ backgroundColor: '#009387' }}>
                            Questionnaire
              </Button>
                    </View>
                    <Text
                        style={{
                            color: 'grey',
                            textAlign: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: 12,
                            marginHorizontal: 20,
                            marginBottom: 30,
                        }}>
                        Ce questionnaire vous permettra de trouver un professionnel de
                        santé qui vous convient.
            </Text>
                </View>
            </View>
        </Modal>
    );
};

export default Message


const styles = StyleSheet.create({
    modalView: {
        position: 'absolute',
        marginHorizontal: 15,
        backgroundColor: 'white',
        flex: 1,
        borderBottomEndRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
    },
});