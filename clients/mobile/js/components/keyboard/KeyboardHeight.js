import React, {useEffect, useState} from 'react';
import { View, Keyboard } from 'react-native';

const KeyboardHeight = () => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    function onKeyboardDidShow(keyboardEvent) {
        setKeyboardHeight(keyboardEvent.endCoordinates.height);
    }
    
    function onKeyboardDidHide() {
        setKeyboardHeight(0);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
        return () => {
            Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
        };
    }, []);

    return (
        <View style={{height: keyboardHeight}}>
        </View>
    )
}

export default KeyboardHeight;