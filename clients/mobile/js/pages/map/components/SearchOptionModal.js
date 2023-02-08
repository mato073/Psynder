import React from 'react'
import { View, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Slider from '@react-native-community/slider';
import { Modal, Portal, Text } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import LinearGradientButton from '../../../components/LinearGradientButton'
import TextInputAutoComplete from '../../../components/TextInputAutoComplete'
import { CardCross } from './MapCards'

import GeneralStyle from '../../../theme/GeneralStyle'

const SearchOptionModal = (props) => {
  const {searchOptionModalVisible, setSearchOptionModalVisible, oneTherapistInfo,
    localization, autoCompleteText, setAutoCompleteText, setAutoCompleteLocationData,
    distanceChoose, setDistanceChoose, setDisplayDistanceChoose, displayDistanceChoose,
    ValidateSearchOption, switchEnabled} = props

  return (
    <Portal>
      <Modal visible={searchOptionModalVisible} onDismiss={() => setSearchOptionModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView keyboardShouldPersistTaps={'handled'} style={GeneralStyle.modal}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} enableOnAndroid={true}>
              <View style={{marginHorizontal: 10}}>
                <CardCross 
                  isModal={true} 
                  oneTherapistInfo={oneTherapistInfo} 
                  isModalClose={() => setSearchOptionModalVisible(false)} />
              </View>
              <View style={{marginHorizontal: 20}}>
                <Text style={styles.modalTitle}>Options de recherche</Text>
                <View style={{marginTop: 10}}>
                  <View style={{marginTop: 5, marginBottom: 10}}>
                    <Text style={styles.modalText}>Adresse actuelle:</Text>
                    <Text style={{color: 'black', textAlign: 'center'}}>{localization.address}</Text>
                  </View>
                  <Text style={styles.modalText}>Changer d'adresse:</Text>
                  {/* <CustomSwitch
                    isEnabled={switchEnabled}
                    setIsEnabled={setSwitchEnabled}
                    isEnabledText={"Localisation du téléphone"} 
                    isDisabledText={"Auto-complétion"}/> */}
                  {switchEnabled === true
                  ? <View style={{marginHorizontal: 20, marginTop: 10}}>
                      <LinearGradientButton 
                        theme={"User"}
                        textSize={10}
                        //onPress={() => ValidateSearchOption()}
                        icon={<Entypo name="location" color={'white'} size={10}/>}
                        text={"Utilisez votre localisation"}/>
                    </View>

                  : <View style={{marginTop: 5}}>
                      <TextInputAutoComplete
                        placeholder={"Changer d'adresse"}
                        autoCompleteText={autoCompleteText}
                        setAutoCompleteText={(text) => setAutoCompleteText(text)}
                        setAutoCompleteLocationData={(locationData) => setAutoCompleteLocationData(locationData)}/>
                    </View>
                  }
                </View>
               {/*  <View style={{marginTop: 20}}>
                  <Text style={styles.modalText}>Trier les thérapeutes par:</Text>
                  <View style={styles.modalPickerView}>
                    <Picker
                      itemStyle={styles.modalPickerItems} */}
                     {/*  selectedValue={multipleAnswersValue}
                      onValueChange={(itemValue, itemIndex) =>
                      setMultipleAnswerValue(itemValue)
                      } */}
                  {/*   >
                      <Picker.Item label={"Pourcentage de matching"} value={"Pourcentage de matching"} />
                      <Picker.Item label={"Distance"} value={"Distance"} />
                      <Picker.Item label={"Prix"} value={"Prix"} />
                    </Picker>
                  </View>
                </View> */}
                <View style={{marginTop: 20}}>
                  <Text style={styles.modalText}>Distance de recherche:</Text>
                  <Slider
                    minimumValue={10}
                    maximumValue={200}
                    step={10}
                    value={distanceChoose}
                    minimumTrackTintColor="#009387"
                    maximumTrackTintColor="#000000"
                    onSlidingComplete={distance => setDistanceChoose(distance)}
                    onValueChange={distance => setDisplayDistanceChoose(distance)}/>
                  <Text style={[styles.modalText, {textAlign: 'center'}]}>{displayDistanceChoose}km</Text>
                </View>
                <View style={{marginTop: 20, marginBottom: 20}}>
                  <LinearGradientButton 
                    theme={"User"}
                    textSize={15}
                    onPress={() => ValidateSearchOption()}
                    icon={<Entypo name="check" color={'white'} size={18}/>}
                    text={"Valider les changements"}/>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </ScrollView>
        </TouchableWithoutFeedback>
      </Modal>
    </Portal>
  )
}

export default SearchOptionModal

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1
  },
  cardText: {
    fontWeight: 'bold',
    //color: "#555555",
  },
  modalTitle: {
    textAlign:'center', 
    color: "#555555", 
    fontWeight: "bold", 
    fontSize: 30
  },
  modalText: {
    color: "#555555", 
    fontWeight: "bold", 
    fontSize: 15
  },
  modalPickerView: {
    justifyContent: "center", 
    marginTop: 5, 
    marginHorizontal: 10, 
    borderWidth: 2, 
    borderColor: "#009387", 
    borderRadius: 90
  },
  modalPickerItems: {
    margin: 10, 
    alignSelf: 'center', 
    textAlign: "center", 
    fontSize: 10 
  }
});