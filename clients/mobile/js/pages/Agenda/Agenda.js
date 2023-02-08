import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import CalandarTherapis from './CalandarTherapist'
import { format, compareAsc, isSameDay, getHours } from 'date-fns';
import { Card, Portal, FAB, Title, Modal } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';

import { get_selected_appointment } from '../../services/appointment_service'
import Entypo from 'react-native-vector-icons/Entypo';

import Loader from '../../components/Loader';
import CustomTextInput from '../../components/CustomTextInput'
import LinearGradientButton from '../../components/LinearGradientButton'

const B = (props) => <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>

const Agenda = (props) => {
    const { colors } = useTheme()

    const [date, setDate] = useState(new Date());
    const [appointments, setAppointments] = useState();
    const [visible, setVisible] = React.useState(false);
    const [weekDate, setWeekDate] = React.useState([]);
    const [loader, setLoader] = React.useState(true);

    const showModal = () => setVisible(!visible);
    useEffect(() => {
        setLoader(true)
        const getSelectedAppointments = async (day1, day7) => {
            const data = await get_selected_appointment(true, day1, day7);
            setAppointments(data.appointments);
        }
        getSelectedAppointments(weekDate[0], weekDate[1]);
        setLoader(false)
    }, [weekDate]);

    const goToappointment = (appointment) => {
        //props.dispatch(send_appointment(appointment));
        props.navigation.navigate('AppointmentTherapist', {appointment});
    }

    const appointmentCard = (appointment) => {
        const date2 = new Date(appointment.date);
        const name = `${appointment.user.firstName} ${appointment.user.lastName}`;
        const dtDateOnly = new Date(date2.valueOf() + date2.getTimezoneOffset() * 60 * 1000);
        const hour = format(dtDateOnly, 'k:mm');
        return (
            <TouchableOpacity onPress={() => goToappointment(appointment)} style={{ padding: 10 }} >
                <Card style={{backgroundColor: colors.background}}>
                    <Card.Title title='Rendez-vous' />
                    <Card.Content>
                        <Text style={{color: colors.text}}><B>Avec :</B> {name}</Text>
                        <Text style={{color: colors.text}}><B>À :</B> {hour}</Text>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        )
    }

    const custom_sort = (a, b) => {
        return compareAsc(new Date(a.date), new Date(b.date));
    }

    const dayAppointment = () => {
        if (appointments === null || !appointments) return null ;     
        let appointmentsToday = appointments?.filter(item => isSameDay(date, new Date(item.date)) === true);
        appointmentsToday?.sort(custom_sort);
        return appointmentsToday?.map((appointment, key) => {
            let newDate = new Date(appointment.date);
            const dtDateOnly = new Date(newDate.valueOf() + newDate.getTimezoneOffset() * 60 * 1000);
            const noon = [];
            if (getHours(newDate) < 12)
                noon.push(styles.postNoon)
            else
                noon.push(styles.pastNoon)
            return (
                <View key={key}>
                    <Text style={noon}>{format(dtDateOnly, 'k:mm')}</Text>
                    {appointmentCard(appointment)}
                </View>
            )
        })
    }

    const ModalNewSlot = () => {
        const containerStyle = { backgroundColor: 'white', padding: 10, marginRight: 13, marginLeft: 13, borderRadius: 13 };
        return (
            <Portal>
                <Modal visible={visible} onDismiss={showModal} contentContainerStyle={containerStyle}>
                    <View>
                        <TouchableOpacity onPress={showModal}>
                            <Entypo name="cross" color={'grey'} size={35} />
                        </TouchableOpacity>
                        <Title style={{ textAlign: "center" }}>Crée un nouveau créneau</Title>
                        <View style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 10 }}>
                            <CustomTextInput label={"Date"} type='date' ></CustomTextInput>
                            <CustomTextInput label={"Heure"} type='date' ></CustomTextInput>
                        </View>
                        <View style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 10 }}>
                            <LinearGradientButton theme={"Therapist"} textSize={16} text={'Enregistrer'} />
                        </View>
                    </View>
                </Modal>
            </Portal>
        )
    }

    const NewSlot = () => {
        return (
            <Portal>
                <ModalNewSlot />
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <View style={{ marginBottom: 60, flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <FAB
                            style={styles.fab}
                            icon="plus"
                            onPress={showModal}
                        />
                    </View>
                </View>
            </Portal>
        )
    }

    if (loader === true)
        return (
            <Loader/>
        )
    return (
        <View style={styles.container}>
            <View style={styles.calandar}>
                <CalandarTherapis date={date} onchange={(newDate) => setDate(newDate)} setWeekDate={(value) => setWeekDate(value)} />
            </View>
            <View style={{ flex: 3, backgroundColor: colors.agenda }}>
                <ScrollView>
                    {dayAppointment()}
                </ScrollView>
            </View>
            {/* <NewSlot /> */}
        </View>
    );

}

export default Agenda;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column'
    },
    calandar: {
        flex: 1,
    },
    postNoon: {
        color: '#2c70af',
        fontSize: 17,
        paddingLeft: 12,
        marginTop: 10
    },
    pastNoon: {
        color: '#ea0e0e',
        fontSize: 17,
        paddingLeft: 12,
        marginTop: 10
    },
    PortalStyle: {
        display: 'flex',
        flex: 1,
        backgroundColor: 'red'
    },
    fab: {
        marginRight: 10,
        right: 0,
        bottom: 0,
        backgroundColor: '#1797e8'
    },
})