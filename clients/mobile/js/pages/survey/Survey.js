import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { get_survey_names, get_questions } from '../../services/survey_service'
import Loader from '../../components/Loader';
import { getUserData } from '../../Redux/Saga/selectors/selector';

import SurveyStartButton from './components/SurveyStartButton';
import SurveyQuestions from './components/SurveyCategory';

const Survey = (props) => {
  const { colors } = useTheme()
  const [names, setNames] = useState();
  const [category, setCategory] = useState();
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(0);
  const [userDisorder, setUserDisorder] = useState(0);
  const [questionsPosition, setQuestionsPosition] = useState(0);
  //Need to find a solution about a wait for useState
  const [answerToSend, setAnswerToSend] = useState([]);

  const InitSurvey = async () => {
    setVisible(true);
    let name = names.names[questionsPosition];
    const json = await get_questions(name);
    setIndex(0);
    setSize(json.Questions.length);
    setCategory(json);
  };

  const ResetSurvey = async () => {
    setQuestionsPosition(0);
    setVisible(true);
    let name = names.names[0];
    const json = await get_questions(name);
    setAnswerToSend([]);
    setIndex(0);
    setSize(json.Questions.length);
    setCategory(json);
  }

  useEffect(() => {
    //Get all survey category name
    const getSurveyName = async () => {
      const result = await get_survey_names();
      setNames(result);
    };

    //Get number of user disorders
    const getDisorder = async () => {
      let disorderNumber = props.userdata.data.user.potentialDisorders.length;
      if (disorderNumber === undefined)
        disorderNumber = 0;
      setUserDisorder(disorderNumber);
      setQuestionsPosition(disorderNumber);
    };

    getSurveyName();
    getDisorder();
  }, [setNames]);

  //category list not loaded
  if (names === undefined) {
    return <Loader/>;
  } else {
    return (
      <View style={{ flex: 1 }}>
        <SurveyQuestions names={names} category={category} setCategory={setCategory} 
          visible={visible} setVisible={setVisible} index={index} 
          setIndex={setIndex} size={size} setSize={setSize} 
          questionsPosition={questionsPosition}
          setQuestionsPosition={setQuestionsPosition} 
          answerToSend={answerToSend} setAnswerToSend={setAnswerToSend}/>
        <View style={{ paddingHorizontal: 5 }}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Ionicons name="arrow-back" color={'#009387'} size={35} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Questionnaire</Text>
        <View
          style={{justifyContent: 'center', textAlign: 'center', marginTop: 20, marginBottom: 20, marginHorizontal: 10}}>
          <Text style={[styles.text, {color: colors.text}]}>
            {userDisorder < names.names.length 
            ?
              "Bonjour, nous vous proposons de répondre à un questionnaire " +
              "afin de mieux pouvoir vous aider dans votre recherche de thérapeute"
            :
              "Bonjour, vous avez déjà terminé le questionnaire, vous pouvez si vous le souhaité le recommencer " +
              "afin de mieux pouvoir vous aider dans votre recherche de thérapeute"
            }
            </Text>
        </View>
        <SurveyStartButton names={names} userDisorder={userDisorder} InitSurvey={() => InitSurvey()} ResetSurvey={() => ResetSurvey()}/>
      </View>
    );
  }
};

const mapStateToProps = (state) => ({
  userdata: getUserData(state)
});

export default connect(mapStateToProps)(Survey);

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 40,
    margin: 10,
    fontWeight: 'bold',
    color: '#009387',
  },
  text: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  }
});
