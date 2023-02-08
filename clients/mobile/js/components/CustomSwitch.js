import React, {} from 'react';
import { View, Switch, Text } from "react-native";

const CustomSwitch = props => {
    const {isEnabledText, isDisabledText, isEnabled, setIsEnabled} = props;

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <View style={{alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
            <Text style={{color: "black"}}>{isEnabled === true ? isEnabledText : isDisabledText}</Text>
            <Switch
                trackColor={{false: "#009387", true: "#009387"}}
                thumbColor={"white"}
                ios_backgroundColor="#3e3e3e"
                value={isEnabled}
                onValueChange={toggleSwitch}/>
        </View>
    )
}

export default CustomSwitch;