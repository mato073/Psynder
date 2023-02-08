import React, {} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import CustomTextInput from './CustomTextInput'
import { location_autocomplete } from '../services/location_service'

import GeneralStyle from '../theme/GeneralStyle'

const B = (props) => <Text style={{color: 'grey' }}>{props.children}</Text>

const TextInputAutoComplete = props => {
    const {placeholder, setAutoCompleteLocationData, autoCompleteText, setAutoCompleteText} = props;

    const [showAutoCompleteList, setShowAutoCompleteList] = React.useState(true)
    const [autoCompleteData, setAutoCompleteData] = React.useState(null)

    const OnTextInputChange = async (textWritten) => {
        if (showAutoCompleteList === false)
            setShowAutoCompleteList(true)
        setAutoCompleteText(textWritten)
        const autoCompleteLocation = await location_autocomplete(textWritten)
        setAutoCompleteData(autoCompleteLocation);
    }

    const GetAddressCity = (address) => {
        if (address.city !== undefined)
            return address.city
        if (address.town !== undefined)
            return address.town
        if (address.village !== undefined)
            return address.village
    }

    const AutoCompleteElementPress = (address, lat, lng) => {
        const city = GetAddressCity(address);
        let StringAddress = `${address.house_number} ${address.road} ${address.postcode} ${city}`; 
        setShowAutoCompleteList(false)
        setAutoCompleteText(StringAddress)
        setAutoCompleteLocationData({address: StringAddress, lat: Number(lat), lng: Number(lng)})
    }

    const AutoCompleteElement = (address, lat, lng, key) => {
        return (
            <View key={key} style={[styles.autoCompleteElementView , {borderTopWidth: key != 0 ? 1 : 0}]}>
                <TouchableOpacity
                    accessible={true}
                    accessibilityLabel="Sélectionner" 
                    style={{zIndex: 1}} 
                    onPress={() => AutoCompleteElementPress(address, lat, lng)}>
                    <Text numberOfLines={3} style={styles.autocompleteText}>{`${address.house_number} ${address.road}`} <B>{`${address.postcode} ${address.city}`}</B></Text>
                </TouchableOpacity>
            </View>
        )
    }

    const AutoCompleteList = () => {
        return (
            <View style={styles.autoCompleteView}>
                <ScrollView 
                    showsVerticalScrollIndicator={true} 
                    keyboardShouldPersistTaps='never' 
                    style={[GeneralStyle.card, {borderRadius: 5}]}>
                    <View style={{margin: 2}}>
                        {autoCompleteData !== null
                        ?
                            <Text style={{textAlign: "center", fontWeight: "bold", color: "#555555", fontSize: 12}}>Sélectionnez une adresse pour pouvoir valider le changement</Text>
                        :
                            <Text style={{textAlign: "center", fontWeight: "bold", color: "#555555", fontSize: 12}}>Aucune adresse trouvée</Text>
                        }
                    </View>
                    {autoCompleteText.length > 0 && autoCompleteData !== null
                    &&
                        <View>
                            {autoCompleteData.map((data, key) => {
                                /* if (data.display_name) */
                                return AutoCompleteElement(data.address, data.lat, data.lon, key)
                            })}
                        </View> 
                    }
                </ScrollView>
            </View>
        )
    }

    return (
        <View>
            <View>
                <CustomTextInput 
                    colorFocused={'#009387'} 
                    label={placeholder} spaceBottom={false}
                    keyboardType={'email-address'}
                    value={autoCompleteText}
                    multiline={true}
                    valueChange={(textWritten) => OnTextInputChange(textWritten)}
                    isWritten={autoCompleteText.length > 0 ? true : false}
                    autoCapitalize={false} isOtherType={true}/>
            </View>
            <View>
                {autoCompleteText.length > 0 && showAutoCompleteList === true && AutoCompleteList()}
            </View>
        </View>
    )
}

export default TextInputAutoComplete;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    autocomplete: {
        borderRadius: 5,
        zIndex: 1
    },
    autoCompleteView: {
        //zIndex: 1, 
        //position: "absolute", 
        width: '100%', 
        borderRadius: 5,
        //height: 180, 
        //top: 0
    },
    autocompleteText: {
        color: 'black',
        fontSize: 15
    },
    autoCompleteElementView: {
        borderColor: "#555555", 
        paddingVertical: 10, 
        paddingHorizontal: 5
    }
});
  