import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    currentMonth: {
        textAlign: 'center',
        fontSize: 20,
        color: "#555555"
    },
    card: {
        display: 'flex',
        flexDirection: 'row'
    },
    weekDayText: {
        color: 'grey',
        marginBottom: 5,
        fontSize: 15,
    },
    label: {
        fontSize: 15,
        color: 'black',
        textAlign: 'center'
    },
    labelSelected: {
        fontSize: 15,
        color: 'white',
        textAlign: 'center'
    },
    selectedLabel: {
        color: 'white'
    },
    touchable: {
        borderRadius: 20,
        padding: 7.5,
        height: 35,
        width: 35
    },
    selectedTouchableUser: {
        backgroundColor: '#009387'
    },
    selectedTouchableTherapist: {
        backgroundColor: "#1797e8"
    },
    selectedTouchableSameDay: {
        backgroundColor: "grey"
    },
    weekDayItems: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    changeWeek: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    }
})