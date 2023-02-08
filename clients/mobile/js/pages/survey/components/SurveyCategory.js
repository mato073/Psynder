import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, ActivityIndicator} from 'react-native';
import { Button, Text, ProgressBar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';

import { SwitchColor } from '../../../components/function/SwitchColorProgressBar';
import { get_user_data_request } from '../../../Redux/Actions/Actions';
import Loader from '../../../components/Loader';
import { get_questions, post_conditions, post_survey } from '../../../services/survey_service'

const SurveyCategory = (props) => {

    const { names, category, setCategory, visible, setVisible,
        index, setIndex, size, setSize, questionsPosition,
        setQuestionsPosition, answerToSend, setAnswerToSend} = props

    const [buttonDisable, setButtonDisable] = useState(false);
    const [multipleAnswersValue, setMultipleAnswerValue] = useState("Peu de fois");
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const dispatch = useDispatch();

    const PreviousQuestion = () => {
        setButtonDisable(true);

        category.Questions[index - 1].answered = false;
        category.Questions[index - 1].value = false;

        let newAnswerToSend = answerToSend;
        newAnswerToSend.pop();

        setAnswerToSend(newAnswerToSend);

        setIndex(index - 1);

        // enable after 0.5 second
        setTimeout(() => {
            setButtonDisable(false);
        }, 500);
    };

    const IsAnswer = async (value) => {
        setButtonDisable(true);

        //Check if survey is finished
        if (index + 1 == size) {
            await ValidateSurvey();

            //enable after 0.5 second
            setTimeout(() => {
                setButtonDisable(false);
            }, 500);
            return;
        }

        category.Questions[index].answered = true;
        category.Questions[index].value = value;

        let answerAdd = {
            name: category.Questions[index].name,
            value: category.Questions[index].value,
        };

        let newAnswerToSend = answerToSend;
        newAnswerToSend.push(answerAdd);

        if (category.Questions[index].types[0] === "BOOL") {
            let exitSurvey = await post_conditions(category.conditions, newAnswerToSend)
            if (exitSurvey.continuer === true) {
                await ValidateSurvey();
                return;
            }
        }

        setAnswerToSend(newAnswerToSend);
        //Check if survey is not finished
        setIndex(index + 1);

        // enable after 0.5 second
        setTimeout(() => {
            setButtonDisable(false);
        }, 500);
    };

    const ExitSurvey = () => {
        setVisible(false);
        setCategory(undefined);
    };

    const ValidateSurvey = async () => {
        await post_survey(category);
        //12 = number of category
        if (questionsPosition + 1 >= 12) {
            dispatch(get_user_data_request(false));
            setVisible(false);
            setButtonDisable(false);
            return;
        }
        let name = names.names[questionsPosition + 1];
        const json = await get_questions(name);
        setAnswerToSend([]);
        setIndex(0);
        setSize(json.Questions.length);
        setCategory(json);
        setQuestionsPosition(questionsPosition + 1);
        dispatch(get_user_data_request(false));
        setTimeout(() => {
            setButtonDisable(false);
        }, 500);
    };

    const onChangeDate = (event, selectedDate) => {
        setShow(false);
        if (selectedDate != undefined) {
            const currentDate = selectedDate || date;
            let fullDate;
            let year = currentDate.getFullYear();
            let day = currentDate.getDate();
            let month = currentDate.getMonth() + 1;

            if (month < 10)
                month = '0' + month;
            if (day < 10)
                day = '0' + day;
            
            fullDate = `${day}/${month}/${year}`;
            IsAnswer(fullDate);

            //Need to see if this line is necessary
            setDate(currentDate);
        }
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const type_response = () => {
        let type = category.Questions[index].types[0];

        if (type === 'BOOL') {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    textAlign: 'center',
                    justifyContent: 'space-between',
                    alignItems: "center",
                    paddingHorizontal: 40,
                }}>
                    <Button
                        disabled={buttonDisable}
                        color="white"
                        style={{ marginRight: 10 }}
                        onPress={() => buttonDisable !== true && IsAnswer('non')}
                        mode="contained">
                        <Text style={{ fontWeight: 'bold', color: "black" }}>Non</Text>
                    </Button>
                    <Button
                        disabled={buttonDisable}
                        color="white"
                        style={{ marginLeft: 10 }}
                        onPress={() => buttonDisable !== true && IsAnswer('oui')}
                        mode="contained">
                        <Text style={{ fontWeight: 'bold', color: "black"}}>Oui</Text>
                    </Button>
                </View>
            );
        } 
        else if (type === 'ANSWERS') {
            return (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column'
                    }}>
                    <View style={{ flex: 1, justifyContent: "center", marginHorizontal: 10, borderWidth: 2, borderColor: "#009387", borderRadius: 90 }}>
                        <Picker
                            itemStyle={{ alignSelf: 'center', textAlign: "center", fontSize: 10 }}
                            selectedValue={multipleAnswersValue}
                            onValueChange={(itemValue, itemIndex) =>
                                setMultipleAnswerValue(itemValue)
                            }>
                            <Picker.Item label={category.Questions[index].answers[0].name} value={category.Questions[index].answers[0].name} />
                            <Picker.Item label={category.Questions[index].answers[1].name} value={category.Questions[index].answers[1].name} />
                            <Picker.Item label={category.Questions[index].answers[2].name} value={category.Questions[index].answers[2].name} />
                            <Picker.Item label={category.Questions[index].answers[3].name} value={category.Questions[index].answers[3].name} />
                        </Picker>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Button color="#009387" onPress={() => IsAnswer(multipleAnswersValue)} mode="contained">Valider</Button>
                    </View>
                </View>
            )
        } 
        else if (type === 'DATE.FAR') {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: "center",
                }}>
                    <Button
                        color="#009387"
                        style={{ marginBottom: 5, marginTop: 5 }}
                        onPress={showDatepicker}
                        mode="contained">
                        <Text style={{ fontWeight: 'bold', color: 'white' }}>
                            Sélectionner une date
                        </Text>
                    </Button>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            format="DD-MM-YYYY"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDate}/>
                    )}
                </View>
            );
        } 
        else if (type === 'DATE.NEAR') {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: "center",
                }}>
                    <Button
                        color="#009387"
                        style={{ marginBottom: 5, marginTop: 5 }}
                        onPress={showDatepicker}
                        mode="contained">
                        <Text style={{ fontWeight: 'bold', color: 'white' }}>
                            Sélectionner une date
                        </Text>
                    </Button>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            format="DD-MM-YYYY"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDate}/>
                    )}
                </View>
            );
        }
    };

    if (category === undefined) {
        return (
            <Modal visible={visible} animationType={'slide'} transparent={true}>
                <Loader/>
            </Modal>
        );
    } 
    else {
        return (
            <Modal
                visible={visible}
                animationType="slide"
                animationType={'slide'}
                transparent={true}>
                <View style={{
                    width: '100%',
                    height: '70%',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <View style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'black',
                    opacity: 0.6,
                }}/>
                    <View style={styles.modalView}>
                        <LinearGradient useAngle={true} angle={135} colors={['#F1D5BB', '#D1D2F9']} style={styles.modalLinearGradient}>
                            <View style={{
                                paddingHorizontal: 5,
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-between',
                            }}>
                                <TouchableOpacity onPress={() => ExitSurvey()}>
                                    <Entypo name="cross" color={'#555555'} size={35} />
                                </TouchableOpacity>
                                {index != 0 && (
                                    <TouchableOpacity
                                        disabled={buttonDisable}
                                        onPress={() => PreviousQuestion()}>
                                            <Ionicons name="arrow-back" color={"#555555"} size={35} />
                                    </TouchableOpacity>
                                )}
                            </View>
                            {index < size 
                            ? (
                                <View style={{ flex: 1 }}>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <Text style={{
                                                color: '#555555',
                                                borderRadius: 10,
                                                textAlign: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                {Math.round((questionsPosition / names.names.length) * 100)}%
                                            </Text>
                                            <ProgressBar
                                                //progression = number of category finished / number of category
                                                progress={questionsPosition / names.names.length}
                                                color={SwitchColor((questionsPosition / names.names.length) * 100)}
                                                style={{ borderColor: SwitchColor((questionsPosition / names.names.length) * 100), 
                                                borderWidth: 0.5, borderRadius: 10, margin: 10, height: 15 }}/>
                                        </View>
                                    </View>
                                    <View style={{ marginHorizontal: 15, flex: 2, borderBottomWidth: 1, borderBottomColor: "#555555"}}>
                                        <View style={{
                                            flex: 1,
                                            textAlign: 'center',
                                        }}>
                                            <Text style={{
                                                color: '#555555',
                                                textAlign: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                fontSize: 19,
                                            }}>
                                                {category.Questions[index].question}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, padding: 10, marginBottom: 20 }}>
                                        {type_response()}
                                    </View>
                                </View>
                            ) 
                            : (
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <ActivityIndicator color={"#009387"} size="large" />
                                </View>
                            )}
                        </LinearGradient>
                    </View>
                </View>
            </Modal>
        );
    }
};

export default SurveyCategory;

const styles = StyleSheet.create({
    button: {
        flex: 1,
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
    }, 
    modalView: {
        position: 'absolute',
        width: '90%',
        height: '80%',
        flex: 1,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
    },
    modalLinearGradient: {
        flex: 1,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
    }
});