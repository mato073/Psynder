import React, {} from 'react'
import { View, StatusBar } from 'react-native';
import NavigationBar from 'react-native-navbar-color'
import { connect } from 'react-redux';

import { getTheme } from '../Redux/Saga/selectors/selector';

const StatusBarColor = (props) => {
    return (
        <View>
            <StatusBar barStyle={props.theme.data === "light" ? "dark-content" : "light-content"} backgroundColor={props.theme.data === "light" ? "#fff" : "#36393f"}/>
            {NavigationBar.setColor(props.theme.data === "light" ? '#f5f5f5' : '#202225')}
        </View>
    )
}

const mapStateToProps = (state) => ({
    theme: getTheme(state)
});
  
export default connect(mapStateToProps)(StatusBarColor);