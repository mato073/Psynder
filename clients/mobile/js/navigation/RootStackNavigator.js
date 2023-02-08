import React from "react";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Offline from "../pages/Offline"
import NewVersion from "../pages/CheckNewVersion"

import Default from "../pages/login/DefaultLogin";
import Login from "../pages/login/Login";

import Home from "../pages/Homes/User/Home";
import Survey from "../pages/survey/Survey";
import Map from "../pages/map/Map";
import InformationsTherapist from "../pages/InformationsTherapist"
import Profile from "../pages/Profiles/User/Profile";
import Loader from "../components/Loader"
import AppointmentUser from '../pages/AppointmentUser'

import Chat from '../pages/Chat/chat'

import HomeTherapist from "../pages/Homes/Therapist/HomeTherapist";
import Agenda from '../pages/Agenda/Agenda'
import ProfileTherapist from "../pages/Profiles/Therapist/ProfileTherapist";
import AppointmentTherapist from '../pages/AppointmentTherapist'

import { connect } from 'react-redux';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getUserToken, getOnline, getTheme, getUserRole, getVersionIsCorrect } from '../Redux/Saga/selectors/selector';

/**
 * Our LoginStack which contains the default and the Login screen
 */
const LoginStack = createStackNavigator();
const LoginStackScreen = () => (
    <LoginStack.Navigator
        screenOptions={{
            headerShown: false
        }}
        initialRouteName="Default">
        <LoginStack.Screen
            name="Default"
            component={Default}
        />
        <LoginStack.Screen
            name="Login"
            component={Login}
        />
    </LoginStack.Navigator>
);

/**
 * Our client AppStack with every app screens, accessible once user is logged in
 */
const AppClientStack = createStackNavigator();
const AppClientStackScreen = (props) => (
    <AppClientStack.Navigator
        screenOptions={{
            headerShown: false
        }}
        initialRouteName="Bottom">
        <AppClientStack.Screen name="Bottom">
            {() => <AppClientBottomStackScreen {...props} />}
        </AppClientStack.Screen>
        <AppClientStack.Screen
            name="Survey"
            component={Survey}
        />
         <AppClientStack.Screen
            name="InformationsTherapist"
            component={InformationsTherapist}
        />
        <AppClientStack.Screen
            name="AppointmentUser"
            component={AppointmentUser}
        />
    </AppClientStack.Navigator>
);
const AppClientBottomStack = createBottomTabNavigator();
const AppClientBottomStackScreen = (props) => (
    <AppClientBottomStack.Navigator
        screenOptions={{
            headerShown: false,
        }}
        tabBarOptions={{
            activeBackgroundColor: props.theme.data === "light" ? '#fff' : "#2c2f33",
            inactiveBackgroundColor: props.theme.data === "light" ? '#fff' : "#2c2f33",
            activeTintColor: "#009387",
            inactiveTintColor: props.theme.data === "light" ? 'grey' : "#fff",
            labelStyle: {
                fontWeight: 'bold',
                margin: 1,
            }
        }}
        initialRouteName="Accueil">
        <AppClientBottomStack.Screen
            options={{ tabBarIcon: props => (<AntDesign name="home" size={props.size} color={props.color} />) }}
            name="Accueil"
            component={Home}
        />
        <AppClientBottomStack.Screen
            options={{ tabBarIcon: props => (<FontAwesome name="map-o" size={props.size} color={props.color} />) }}
            name="Carte"
            component={Map}
        />
        {/* <AppClientBottomStack.Screen
            options={{ tabBarIcon: props => (<Ionicons name="chatbox-outline" size={props.size} color={props.color} />) }}
            name="Chat"
            component={Chat}
        /> */}
        <AppClientBottomStack.Screen
            options={{ tabBarIcon: props => (<AntDesign name="user" size={props.size} color={props.color} />) }}
            name="Profil"
            component={Profile}
        />
    </AppClientBottomStack.Navigator>
);

/**
 * Our therapist AppStack with every app screens, accessible once user is logged in
 */
const AppTherapistStack = createStackNavigator();
const AppTherapistStackScreen = (props) => (
    <AppTherapistStack.Navigator
        screenOptions={{
            headerShown: false
        }}
        initialRouteName="Bottom">
        <AppClientStack.Screen name="Bottom">
            {() => <AppTherapistBottomStackScreen {...props} />}
        </AppClientStack.Screen>
        <AppClientStack.Screen
            name="Survey"
            component={Survey}
        />
        <AppClientStack.Screen
            name="AppointmentTherapist"
            component={AppointmentTherapist}
        />
    </AppTherapistStack.Navigator>
);
const AppTherapistBottomStack = createBottomTabNavigator();
const AppTherapistBottomStackScreen = (props) => (
    <AppTherapistBottomStack.Navigator
        screenOptions={{
            headerShown: false
        }}
        tabBarOptions={{
            activeBackgroundColor: props.theme.data === "light" ? '#fff' : "#2c2f33",
            inactiveBackgroundColor: props.theme.data === "light" ? '#fff' : "#2c2f33",
            activeTintColor: "#1797e8",
            inactiveTintColor: props.theme.data === "light" ? 'grey' : "#fff",
            labelStyle: {
                fontWeight: 'bold',
                margin: 1,
            }
        }}
        initialRouteName="Accueil">
        <AppTherapistStack.Screen
            options={{ tabBarIcon: props => (<AntDesign name="home" size={props.size} color={props.color} />) }}
            name="Accueil"
            component={HomeTherapist}
        />
        <AppTherapistStack.Screen
            options={{ tabBarIcon: props => (<Fontisto name="date" size={props.size} color={props.color} />) }}
            name="Agenda"
            component={Agenda}
        />
        {/* <AppTherapistStack.Screen
            options={{ tabBarIcon: props => (<Ionicons name="chatbox-outline" size={props.size} color={props.color} />) }}
            name="Chat"
            component={Chat}
        /> */}
        <AppTherapistStack.Screen
            options={{ tabBarIcon: props => (<AntDesign name="user" size={props.size} color={props.color} />) }}
            name="Profil"
            component={ProfileTherapist}
        />
    </AppTherapistBottomStack.Navigator>
);

const LoaderStack = createStackNavigator();
const LoaderStackScreen = () => (
    <LoaderStack.Navigator
        screenOptions={{
            headerShown: false
        }}
        initialRouteName="Loader">
        <LoaderStack.Screen
            name="Loader"
            component={Loader}
        />
    </LoaderStack.Navigator>
);

/**
 * Our AppContainer that will load a quick Loading screen in charge of choosing if we display the Login or App stack
 */
const RootStackScreen = (props) => {
    if (props.online === false)
        return (
            <RootStack.Screen
                name="Offline"
                component={Offline}
                options={{
                    animationEnabled: true
                }}
            />
        )
    if (props.versionIsCorrect.data === false)
        return (
            <RootStack.Screen
                name="NewVersion"
                component={NewVersion}
                options={{
                    animationEnabled: true
                }}
            />
        )
    if (props.userToken.data === null)
        return (
            <RootStack.Screen
                name="Login"
                component={LoginStackScreen}
                options={{
                    animationEnabled: true
                }}
            />
        )
    if (props.userToken.data !== null && props.role.data === "User")
        return (
            <RootStack.Screen
                name="AppClient"
                options={{
                    animationEnabled: true
                }}
            >
                {() => <AppClientStackScreen {...props} />}
            </RootStack.Screen>
        )
    if (props.userToken.data !== null && props.role.data === "Therapist")
        return (
            <RootStack.Screen
                name="AppTherapist"
                options={{
                    animationEnabled: true
                }}
            >
            {() => <AppTherapistStackScreen {...props} />}
            </RootStack.Screen>
        )
    if (props.userToken.data !== null && props.role.data === null)
        return (
            <RootStack.Screen
                name="AppLoader"
                component={LoaderStackScreen}
                options={{
                    animationEnabled: true
                }}
            />
        )
}
const RootStack = createStackNavigator();
const RootStackNavigator = (props) => {
    return (
        <RootStack.Navigator headerMode="none">
            {RootStackScreen(props)}
        </RootStack.Navigator>
    );
}

const mapStateToProps = (state) => ({
    userToken: getUserToken(state),
    online: getOnline(state),
    theme: getTheme(state),
    role: getUserRole(state),
    versionIsCorrect: getVersionIsCorrect(state)
});

export default connect(mapStateToProps)(RootStackNavigator);