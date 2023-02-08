import React, { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { useTheme } from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradientButton from '../components/LinearGradientButton'
import ArrowBack from '../components/ArrowBack'
import IconAndText from '../components/IconAndText'
import CustomAvatar from "../components/CustomAvatar"

const AppointmentTherapist = (props) => {

    const { appointment } = props.route.params

    const { colors } = useTheme()

    const [meting] = useState(appointment);
    const [user] = useState(appointment.user);

    const Information = () => {
        const name = `${user.firstName} ${user.lastName}`;
        
        return (
            <View style={styles.infos}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <CustomAvatar image={require('../../assets/patien.png')} borderWidth={0} width={60} height={60}/>
                    <Text style={{marginHorizontal: 15, flex: 5, fontSize: 18, color: colors.text}}>{name}</Text>
                </View>
            </View>
        )
    }

    const AppointmentDate = () => {
        const date = new Date(meting.date);
        let newDate = format(date, 'dd LLLL yyyy', { locale: fr });

        return (
            <View style={styles.infos}>
                <Text style={[styles.title, {color: colors.text}]}>Date du rendez-vous</Text>
                <View style={styles.element}>
                    <IconAndText text={newDate} textSize={20}
                        icon={<Fontisto name="date" size={20} color={colors.icon} />} />
                </View>
            </View>
        )
    }

    const AppointmentHour = () => {
        const date2 = new Date(meting.date);
        const dtDateOnly = new Date(date2.valueOf() + date2.getTimezoneOffset() * 60 * 1000);
        let newDate = format(dtDateOnly , 'k:mm');

        return (
            <View style={styles.infos}>
                <Text style={[styles.title, {color: colors.text}]}>Heure du rendez-vous</Text>
                <View style={styles.element}>
                    <IconAndText text={newDate} textSize={20}
                        icon={<MaterialCommunityIcons name="clock-time-nine-outline" size={20} color={colors.icon} />} />
                </View>
            </View>
        )
    }

    const Contact = () => {
        
        return (
            <View style={styles.infos}>
                <Text style={[styles.title, {color: colors.text}]}>Contact</Text>
                <View style={styles.element}>
                    <IconAndText text={user.phoneNumber} textSize={16}
                        icon={<Fontisto name="phone" size={20} color={colors.icon} />} />
                </View>
                <View style={styles.element}>
                    <IconAndText text={user.email} textSize={16}
                        icon={<Fontisto name="email" size={20} color={colors.icon} />} />
                </View>
            </View>
        )
    }

    const ReportButton = () => {
        return (
            <View style={styles.button}>
                <View>
                    <LinearGradientButton
                        theme={"Therapist"}
                        text={'Reporter rendez-vous'}
                        textSize={16}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <LinearGradientButton
                        theme={"Grey"}
                        text={'Annuler rendez-vous'}
                        textSize={16}
                    />
                </View>
            </View>
        )

    }


    return (
        <View style={styles.container}>
            <ArrowBack color={'#1797e8'} navigation={props.navigation} />
            <Information />
            <AppointmentDate />
            <AppointmentHour />
            <Contact />
            <ReportButton />
        </View>
    )

}

export default AppointmentTherapist

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        marginTop: 20,
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'column'
    },
    infos: {
        display: 'flex',
        flexDirection: 'column',
        borderBottomColor: "grey",
        borderBottomWidth: 0.5,
        padding: 15
    },
    data: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 15
    },
    wraper: {
        display: 'flex',
        flexDirection: 'row',
        margin: 3,
        flexWrap: 'wrap'
    },
    listItem: {
        margin: 2,
        marginRight: 2,
    },
    avatar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    element: {
        display: 'flex',
        flexDirection: 'row',
        margin: 5
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    button: {
        margin: 20
    }
})