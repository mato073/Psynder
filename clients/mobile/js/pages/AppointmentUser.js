import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native'
import ArrowBack from '../components/ArrowBack'
import { useTheme } from '@react-navigation/native';
import { Chip } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale'
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { get_spe } from '../services/speciality_service'
import LinearGradientButton from '../components/LinearGradientButton'
import IconAndText from '../components/IconAndText'
import CustomAvatar from "../components/CustomAvatar"

const AppointmentUser = (props) => {

    const { appointment } = props.route.params

    const { colors } = useTheme()

    const [meting] = useState(appointment);
    const [therapist] = useState(appointment.therapist);
    const [listSpecialties, setlistSpecialties] = useState();

    useEffect(() => {
        let result = [];
        const getDate = async () => {
            result = await get_spe(therapist.specialties);
            setlistSpecialties(result);
        }
        getDate();

    }, [])

    const Profile = () => {
        const name = `${therapist.firstName} ${therapist.lastName}`;

        const RightIcon = () => {
            
            return (
                <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('InformationsTherapist', {therapistId: therapist._id})}>
                        <MaterialIcons {...props} name="keyboard-arrow-right" color={colors.icon}  size={35} />
                    </TouchableOpacity>
                </View>
            )
        }

        const surTitle = () => {
            if (listSpecialties != undefined) {
                return listSpecialties.map((specialtie, key) => {
                    return (
                        <Chip theme={{dark: false}} style={styles.listItem}>
                            <Text style={{color: "#555555"}}>{specialtie.data.specialty.name}</Text>
                        </Chip>
                    )
                })
            } else {
                return (
                    <Text style={{color: colors.text}}>Pas de spécialités à afficher</Text>
                )
            }
        }
        return (
            <View style={styles.infos}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <CustomAvatar image={require('../../assets/patien.png')} borderWidth={0} width={60} height={60}/>
                    <Text style={{marginHorizontal: 15, flex: 5, fontSize: 18, color: colors.text}}>{name}</Text>
                    {RightIcon()}
                </View>
                <Text style={[styles.title, {color: colors.text, marginTop: 20}]}>Spécialités</Text>
                <View style={styles.wraper}>
                    {surTitle()}
                </View>
            </View>
        );

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
        let newDate = format(dtDateOnly, 'k:mm');

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
                    <IconAndText text={therapist.phoneNumber} textSize={16}
                        icon={<Fontisto name="phone" size={20} color={colors.icon} />} />
                </View>
                <View style={styles.element}>
                    <IconAndText text={therapist.email} textSize={16}
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
                        theme={"User"}
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
        <ScrollView style={styles.container}>
            <ArrowBack color={'#009387'} navigation={props.navigation} />
            <Profile />
            <AppointmentDate />
            <AppointmentHour />
            <Contact />
            <ReportButton/>
        </ScrollView>
    )
}

export default AppointmentUser;

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