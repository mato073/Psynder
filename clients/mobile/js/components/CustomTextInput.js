import React, {} from 'react';
import { View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

const CustomTextInput = props => {
    const { colorFocused, label, icon, lockIcon, printPasswordText, 
            spaceBottom, hasErrors, helperText, printHelperText, keyboardType, multiline,
            isWritten, isNumeric, isName, autoCapitalize, isOtherType, value, valueChange, scrollViewRef} = props;
    
    const { colors } = useTheme()

    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const [textInputY, setTextInputY] = React.useState(0);

    const OnChangeTextInput = (inputText) => {
        if (isName === true)
            //Remove all invalid characters for name text input
            inputText = inputText.replace(/[`~0-9!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/g, '');
        else if (isOtherType === undefined)
            inputText = inputText.trim();
        if (isNumeric === true) {
            //Remove invalid character for phone number
            inputText = inputText.replace(/[^0-9]/g, "");
            if (inputText.length > 0) {
                //Add space every 2 numbers
                inputText = inputText.match(new RegExp('.{1,2}', 'g')).join(' ');
            }
        }
        valueChange(inputText);
    }

    const IconRight = () => {
        if (lockIcon === true)
            return (
                <TextInput.Icon name={() => 
                    <Button onPress={() => setSecureTextEntry(!secureTextEntry)} color={colors.text} style={{backgroundColor: "transparent"}}>
                        {secureTextEntry 
                            ? <Feather name="eye-off" color={colors.text} size={20}/>
                            : <Feather name="eye" color={colors.text} size={20}/>
                        }
                    </Button>
                }/>
            )
        if ((hasErrors === true || hasErrors === false) && printHelperText === true)
            return (
                <TextInput.Icon name={() =>
                    hasErrors === false
                    ? <FontAwesome5 name="check-circle" color={colorFocused} size={22}/>
                    : <Entypo name="circle-with-cross" color="#DC143C" size={25}/>
                }
                />
            )
        if (hasErrors === false && printHelperText === false)
            return (
                <TextInput.Icon name={() => <FontAwesome5 name="check-circle" color={colorFocused} size={22}/>}/>
        )
    }

    const colorPlaceholder = () => {
        if (printHelperText === true && hasErrors === true)
            return "#DC143C";
        if (isWritten === true)
            return colorFocused;
        if (hasErrors === false)
            return colorFocused;
        return colors.text;
    }

    const colorPrimary = () => {
        if (printHelperText === true && hasErrors === true)
            return "#DC143C";
        return colorFocused;
    }

    return (
        <View 
            onLayout={(event) => {
                setTextInputY(event.nativeEvent.layout.y)
            }}>
            <TextInput
                left={icon !== undefined && <TextInput.Icon name={() => <View style={{marginRight: 10}}>{icon}</View>}/>}
                right={IconRight()}
                secureTextEntry={lockIcon === true ? secureTextEntry ? true : false : false}
                theme={{
                    colors: {
                        background: colors.background,
                        placeholder: colorPlaceholder(),
                        text: colors.text, 
                        primary: colorPrimary()
                    }
                }}
                onFocus={() => scrollViewRef !== undefined && scrollViewRef.current.scrollTo({y: textInputY, animated: true})}
                multiline={multiline}
                numberOfLines={multiline === true ? 2 : 1}
                value={value}
                onChangeText={(inputText) => OnChangeTextInput(inputText)} 
                mode="outlined"
                autoCapitalize={autoCapitalize === false ? 'none' : 'sentences'}
                keyboardType={keyboardType === null ? 'default' : keyboardType}
                label={label}/>
            {spaceBottom === true
            && (
                (printPasswordText === true && printHelperText === false) || (printPasswordText === true && printHelperText === true && hasErrors === false)
                ?
                    <HelperText padding={'none'} style={{color: colors.text, marginBottom: 3, fontWeight: "bold"}} 
                        type={'error'} visible={true}>
                        {helperText}
                    </HelperText>
                :
                    <HelperText padding={'none'} style={{marginBottom: 3, fontWeight: "bold"}} type={'error'} visible={printHelperText == true && hasErrors == true ? true : false}>
                        {helperText}
                    </HelperText>
            )}   
        </View>
    )
}

export default CustomTextInput;