import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, ProgressBar, Text } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import * as Animatable from 'react-native-animatable';

import { SwitchColor } from '../../../components/function/SwitchColorProgressBar'
import CustomAvatar from "../../../components/CustomAvatar"
import LinearGradientButton from '../../../components/LinearGradientButton'

import GeneralStyle from '../../../theme/GeneralStyle'

const CARD_WIDTH = 290;

export const CardCross = (props) => {
    const {isModal, oneTherapistInfo, isModalClose, isNotModalClose} = props

    return (
        <View style={{flexDirection: "row-reverse", marginLeft: oneTherapistInfo == true ? 0 : 5}}>
            <TouchableOpacity 
                onPress={isModal === true ? isModalClose : isNotModalClose}>
                <Entypo name="cross" color={'grey'} size={30} />
            </TouchableOpacity>
        </View>
    )
}

export const TherapistCard = (props) => {
    const {image, name, percent, job, distance, price, 
        address, navigate, therapistId} = props

    return (
        <Card style={[GeneralStyle.card, styles.card]}>
            <View style={styles.cardView}>
                <View style={{justifyContent: 'center', alignItems: 'center', flex: 0.5}}>
                    <CustomAvatar color={'#009387'} image={image} width={75} height={75}/>
                </View>
                <View style={{flex: 1, marginRight: 3, justifyContent: 'center'}}>
                    <Text numberOfLines={2} style={{color: '#555555', textAlign: 'center',  fontWeight: 'bold', fontSize: 15}}>{name}</Text>
                    <ProgressBar
                        progress={percent / 100}
                        color={SwitchColor(percent)}
                        style={{borderRadius: 10, margin: 10, height: 10}}/>
                    <View style={{flexDirection: 'row', marginHorizontal: 10, justifyContent: 'space-around'}}>
                        {job !== undefined
                        &&
                            <View style={styles.cardTextView}>
                                <Text style={styles.cardText}>{job}</Text>
                            </View>
                        }
                        <View style={styles.cardTextView}>
                            <Text style={styles.cardText}>{distance} km</Text>
                        </View>
                        {price !== undefined
                        &&
                            <View style={styles.cardTextView}>
                                <Text style={styles.cardText}>~{price}€</Text>
                            </View>
                        }
                    </View>
                </View>
            </View>
            <View style={{marginHorizontal: 5}}>
                <Text numberOfLines={2} style={[styles.cardText, {textAlign: 'center'}]}>{address}</Text>
            </View>
            <View style={{marginBottom: 10, marginTop: 10, justifyContent:'center', flexDirection: 'row'}}>
                <View style={{marginHorizontal: 10}}>
                    <LinearGradientButton 
                        theme={"User"}
                        textSize={10}
                        onPress={navigate}
                        text={"Allez vers"}/>
                </View>
                <View style={{marginHorizontal: 10}}>
                    <LinearGradientButton
                        theme={"User"}
                        textSize={10}
                        onPress={() => props.navigation.navigate('InformationsTherapist', {therapistId: therapistId})}
                        text={"Voir plus"}/>
                </View>
            </View>
        </Card>
    )
}


export const OneTherapistCardView = (props) => {
    const {closeTherapistView, oneTherapistInfo, therapistList, 
        oneTherapistId, animateToRegion, navigation} = props

    return (
      <Animatable.View
        useNativeDriver={true}
        animation="pulse">
        <CardCross 
          isModal={false} 
          oneTherapistInfo={oneTherapistInfo} 
          isNotModalClose={() => closeTherapistView()}/>
        {therapistList !== null && oneTherapistId !== null
        &&
          therapistList.map((therapist, key) => {
            if (oneTherapistId === therapist._id)
              return (
                <View key={key}>
                  <TherapistCard
                    image={require('../../../../assets/patien.png')} 
                    name={therapist.firstName + " " + therapist.lastName} 
                    percent={therapist.matchingPercentage} 
                    //job={"TCC"} 
                    distance={therapist.distanceInKm} 
                    //price={70}
                    address={therapist.location.formattedAddress}
                    navigate={() => animateToRegion(therapist.location.lat, therapist.location.lng, 0.2)}
                    therapistId={therapist._id}
                    navigation={navigation}/>
                </View>
              )
          })
        }
      </Animatable.View>
    )
}

export const AllTherapistCardView = (props) => {
    const {closeTherapistView, oneTherapistInfo, therapistList, 
        animateToRegion, navigation} = props

    return (
      <Animatable.View
        useNativeDriver={true}
        animation="fadeInUpBig">
        <CardCross 
          isModal={false} 
          oneTherapistInfo={oneTherapistInfo} 
          isNotModalClose={() => closeTherapistView()}/>
        <ScrollView 
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={true}>
          {therapistList !== null 
          &&
            therapistList.map((therapist, key) => {
              return (
                <View key={key}>
                  <TherapistCard
                    image={require('../../../../assets/patien.png')} 
                    name={therapist.firstName + " " + therapist.lastName} 
                    percent={therapist.matchingPercentage} 
                    //job={"TCC"} 
                    distance={therapist.distanceInKm} 
                    //price={70} 
                    address={therapist.location.formattedAddress}
                    navigate={() => animateToRegion(therapist.location.lat, therapist.location.lng, 0.2)}
                    therapistId={therapist._id}
                    navigation={navigation}/>
                </View>
              )
            })
          }
        </ScrollView>
      </Animatable.View>
    )
}

const styles = StyleSheet.create({
    card: {
      marginBottom: 10,
      marginHorizontal: 10,
      width: CARD_WIDTH,
    },
    cardView: {
      flex: 1,
      marginTop: 10,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    cardTextView: {
      paddingHorizontal: 5, 
      borderRadius: 5, 
      borderWidth: 1.5,
      borderColor: "#009387"
    },
    cardText: {
      fontWeight: 'bold',
      color: "#555555",
    }
});