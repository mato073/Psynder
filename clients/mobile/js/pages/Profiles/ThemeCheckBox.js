import React, {useEffect} from 'react';
import { View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';
import { connect } from 'react-redux';
import { useTheme } from '@react-navigation/native';

import { getUserData, getTheme } from '../../Redux/Saga/selectors/selector';
import { get_theme_request } from '../../Redux/Actions/Actions';

const ThemeCheckBox = (props) => {
    const [checkedLight, setCheckedLight] = React.useState(false);
    const [checkedDark, setCheckedDark] = React.useState(false);

    const { colors } = useTheme()

    useEffect(() => {
        if (props.theme.data === "light")
            setCheckedLight(true)
        else
            setCheckedDark(true)
    }, [])

    return (
        <View style={{flex: 1}}>
            <View style={{marginHorizontal: 20}}>
                <Text style={{fontSize: 22, fontWeight: "bold", color: colors.text}}>Thème</Text>
                <View style={{marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Text style={{fontSize: 15, color: colors.text}}>Clair</Text>
                    <Checkbox
                        color={props.role.data === "User" ? "#009387" : "#1797e8"}
                        status={checkedLight ? 'checked' : 'unchecked'}
                        onPress={() => {
                            if (checkedLight === false)
                                props.dispatch(get_theme_request("light"));
                            setCheckedDark(false);
                            setCheckedLight(true);
                        }}
                    />
                </View>
                <View style={{marginTop: 10, marginBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Text style={{fontSize: 15, color: colors.text}}>Sombre</Text>
                    <Checkbox
                        color={props.role.data === "User" ? "#009387" : "#1797e8"}
                        status={checkedDark ? 'checked' : 'unchecked'}
                        onPress={() => {
                            if (checkedDark === false)
                                props.dispatch(get_theme_request("dark"));
                            setCheckedLight(false);
                            setCheckedDark(true);
                        }}
                    />
                </View>
            </View>
        </View>
    )
}

const mapStateToProps = (state) => ({
    theme: getTheme(state),
    role: getUserData(state)
});

export default connect(mapStateToProps)(ThemeCheckBox)