import React, {} from 'react'
import { View } from 'react-native';

import LinearGradientButton from '../../../components/LinearGradientButton'

const SurveyStartButton = (props) => {
    const {names, userDisorder, InitSurvey, ResetSurvey} = props

    //if none of the category has been finished
    if (userDisorder === 0) {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    textAlign: 'center',
                    justifyContent: 'center',
                    marginTop: 40,
                    marginHorizontal: 30
                }}>
                <LinearGradientButton
                    textSize={15}
                    theme={"User"}
                    text={"Commencer"}
                    onPress={() => InitSurvey()}/>
            </View>
        )
    }
    //if more than one category has been finished but all the category are not finished
    else if (userDisorder < names.names.length) {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    textAlign: 'center',
                    justifyContent: 'space-between',
                    marginTop: 40,
                    marginHorizontal: 30
                }}>
                <LinearGradientButton
                    textSize={15}
                    theme={"Red"}
                    text={"Recommencer"}
                    onPress={() => ResetSurvey()}/>
                <LinearGradientButton
                    textSize={15}
                    theme={"User"}
                    text={"Continuer"}
                    onPress={() => InitSurvey()}/>
            </View>
        )
    }
    //If all the survey category has been finished
    else {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    textAlign: 'center',
                    justifyContent: 'center',
                    marginTop: 40,
                    marginHorizontal: 30
                }}>
                <LinearGradientButton
                    textSize={15}
                    theme={"Red"}
                    text={"Recommencer"}
                    onPress={() => ResetSurvey()}/>
            </View>
        )
    }
}
  
export default SurveyStartButton;