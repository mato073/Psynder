import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ProgressBar, Chip, Text, Modal, Portal } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { addDays, getDate, format, isSameDay, isToday, addMonths, startOfMonth, getDaysInMonth, setHours, setMinutes, setSeconds} from 'date-fns';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { fr } from 'date-fns/locale'
import { connect, useDispatch } from 'react-redux'
import { useTheme } from '@react-navigation/native';

import { get_Therapist_with_id } from '../services/user_service'
import { post_appointment } from '../services/appointment_service'

import { getUserData } from '../Redux/Saga/selectors/selector';
import { get_user_data_request } from '../Redux/Actions/Actions';
import { CheckDataLoading, CheckDataError } from '../components/function/CheckData';

//Import our components
import Loader from '../components/Loader';
import ArrowBack from '../components/ArrowBack'
import IconAndText from "../components/IconAndText"
import { SwitchColor } from '../components/function/SwitchColorProgressBar'
import CustomAvatar from "../components/CustomAvatar"
import LinearGradientButton from '../components/LinearGradientButton'
import CustomTextInput from '../components/CustomTextInput'
import SnackBar from '../components/SnackBar'

import GeneralStyle from '../theme/GeneralStyle'
import CalendarStyle from '../theme/CalendarStyle'

const InformationsTherapist = (props) => {

    const dispatch = useDispatch()

    const { colors } = useTheme()

    const { therapistId } = props.route.params;

    const [snackBarVisible, setSnackBarVisible] = React.useState(false);
    const [snackBarText, setSnackBarText] = React.useState('');
    const [snackBarTheme, setSnackBarTheme] = React.useState("error");

    const [loader, setLoader] = useState(true);
    const [dateChosen, setDateChosen] = useState(new Date());
    const [monthDays, setMonthDays] = useState([]);
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [therapistInfo, setTherapistInfo] = useState(null);

    const [appointmentHour, setAppointmentHour] = useState('')
    
    const weekDays = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."]

    const GetMonthDays = (actualDate) => {
        const start = startOfMonth(actualDate);
        const daysInMonth = getDaysInMonth(actualDate)

        let final = [];
        final.push([]);
        let dayNum = 0;
        let i = 0;
        let x = 0
        while (dayNum < daysInMonth) {
            const date = addDays(start, dayNum);
            final[i].push({
                formatted: format(date, 'EEE', { locale: fr }),
                date,
                day: getDate(date)
            });
            if (final[i][x].formatted === "dim." && dayNum < daysInMonth - 1) {
                final.push([]);
                i++;
                x = -1;
            }
            x++;
            dayNum++;
        }
        return final;
    }

    const SetMonthAndYear = (date) => {
        const todayMonth = format(date, 'LLLL', { locale: fr });
        setMonth(todayMonth.charAt(0).toUpperCase() + todayMonth.slice(1));
        setYear(format(date, 'uuuu'));
    }

    useEffect(async () => {
        setMonthDays(GetMonthDays(dateChosen));
        SetMonthAndYear(dateChosen)
        
        const therapistInfoId = await get_Therapist_with_id(therapistId);
        setTherapistInfo(therapistInfoId);

        setLoader(false)
    }, []);

    useEffect(() => {
        GetData()
    }, [dispatch]);
    
    const GetData = () => {
        dispatch(get_user_data_request(false));
    }

    const ChangeMonth = (increase) => {
        let newMonthDate = addMonths(dateChosen, increase === true ? 1 : -1);
        setDateChosen(newMonthDate);
        setMonthDays(GetMonthDays(newMonthDate));
        SetMonthAndYear(newMonthDate);
    }

    const MonthChoose = () => {
        return (
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity onPress={() => ChangeMonth(false)}>
                <MaterialIcons name="keyboard-arrow-left" color={'#009387'} size={30}/>
            </TouchableOpacity>
            <Text style={CalendarStyle.currentMonth}> {`${month} ${year}`} </Text>
            <TouchableOpacity onPress={() => ChangeMonth(true)}>
               <MaterialIcons name="keyboard-arrow-right" color={'#009387'} size={30}/>
            </TouchableOpacity>
          </View>
        );
    }

    const AppointmentFormattedDays = () => {
        return (
            <View style={CalendarStyle.container}>
                {weekDays.map((day, key) => {
                    return (
                        <Text key={key} style={CalendarStyle.weekDayText}>{day}</Text>
                    )
                })}
            </View>
        )
    }

    const AppointmentDaysEmpty = (key) => {
        return (  
            <View key={key} style={CalendarStyle.touchable}>    
            </View>
        )
    }

    const AppointmentDays = (day, key) => {
        return (
            <View key={key}>
                {isSameDay(day.date, dateChosen)
                ?
                    <TouchableOpacity onPress={() => setDateChosen(day.date)} style={[CalendarStyle.touchable, CalendarStyle.selectedTouchableUser]}>
                        <Text style={CalendarStyle.labelSelected}>{day.day}</Text>
                    </TouchableOpacity>
                : (
                    isToday(day.date)
                    ?
                        <TouchableOpacity onPress={() => setDateChosen(day.date)} style={[CalendarStyle.touchable, CalendarStyle.selectedTouchableSameDay]}>
                            <Text style={CalendarStyle.labelSelected}>{day.day}</Text>
                        </TouchableOpacity>
                    :
                        <TouchableOpacity onPress={() => setDateChosen(day.date)} style={CalendarStyle.touchable}>
                            <Text style={CalendarStyle.label}>{day.day}</Text>
                        </TouchableOpacity>
                )
                }
            </View >
        )
    }

    const AppointmentWeekDays = (week, viewKey) => {
        if (week.length !== 7) {
            if (week[0].formatted === weekDays[0]) {
                return (
                    <View style={CalendarStyle.container}>
                        {week.map((day, key) => {
                            return AppointmentDays(day, key)
                        })}
                        {Array.apply(null, Array(7 - week.length)).map((day, key) => {
                            return AppointmentDaysEmpty(key)
                        })}
                    </View>
                )
            }
            else if (week[week.length - 1].formatted === weekDays[6]) {
                return (
                    <View style={CalendarStyle.container}>
                        {Array.apply(null, Array(7 - week.length)).map((day, key) => {
                            return AppointmentDaysEmpty(key)
                        })}
                        {week.map((day, key) => {
                            return AppointmentDays(day, key)
                        })}
                    </View>
                )
            }
        }
        else {
            return (
                <View key={viewKey} style={CalendarStyle.container}>
                    {week.map((day, key) => {
                        return AppointmentDays(day, key)
                    })}
                </View>
            )
        }
    }

    const SnackBarPopUp = () => {
        if (snackBarVisible === true)
          return (
            <SnackBar visible={snackBarVisible} theme={snackBarTheme} text={snackBarText} actualVisible={(isVisible) => setSnackBarVisible(isVisible)}/>
          );
    }

    const ValidateAppointment = async () => {
        setLoader(true)
        Keyboard.dismiss();
        if (appointmentHour.length < 1 || appointmentHour.length > 2 || Number(appointmentHour) < 0 || Number(appointmentHour) > 24) {
            setSnackBarTheme("error");
            setSnackBarVisible(true)
            setSnackBarText("L'heure renseignée n'est pas valide")
            setLoader(false)
            return
        }
        let appointmentDate = setHours(dateChosen, appointmentHour);
        appointmentDate = setMinutes(appointmentDate, 0);
        appointmentDate = setSeconds(appointmentDate, 0);
        const result = await post_appointment(props.userdata.data.user._id, therapistId, appointmentDate, 1)
        if (result === false) {
            setSnackBarTheme("error");
            setSnackBarVisible(true)
            setSnackBarText("Une erreur est survenue lors de l'enregistrement du rendez-vous")
        }
        else if (result === true) {
            setSnackBarTheme("success");
            setSnackBarVisible(true)
            setSnackBarText("Le rendez-vous à bien été enregistré")
            setModalVisible(false);
        }
        setLoader(false)
    }

    const ModalTakeAppointment = () => {
        return (
            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} enableOnAndroid={true}>
                            <ScrollView keyboardShouldPersistTaps={'handled'} style={[GeneralStyle.modal, {padding: 5}]}>
                                <View style={{flexDirection: "row-reverse"}}>
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <Entypo name="cross" color={'grey'} size={30} />
                                    </TouchableOpacity>
                                </View>
                                {MonthChoose()}
                                {AppointmentFormattedDays()}
                                {monthDays.map((week, key) => {
                                    return (
                                        <View key={key}>
                                            {AppointmentWeekDays(week, key)}
                                        </View>
                                    )
                                })}
                                <View style={{marginHorizontal: 10}}>
                                    <CustomTextInput
                                        colorFocused={'#009387'} 
                                        icon={<MaterialIcons name="access-time" color="#05375a" size={25}/>} 
                                        label={"Indiquez l'heure ex: 16"} spaceBottom={false}
                                        value={appointmentHour}
                                        valueChange={(text) => setAppointmentHour(text)}
                                        keyboardType={'phone-pad'}
                                        isWritten={appointmentHour.length > 0}/>
                                </View>
                                <View style={{margin: 10}}>
                                    <LinearGradientButton 
                                        theme={"User"}
                                        textSize={15}
                                        onPress={() => ValidateAppointment()}
                                        text={`Valider le rendez-vous`}/>
                                </View>
                            </ScrollView>
                        </KeyboardAwareScrollView>
                    </TouchableWithoutFeedback>
                </Modal>
            </Portal>
        )
    }

    const Profile = () => {
        return (
            <View style={styles.body}>
                <View style={styles.infos}>
                    <Text style={[styles.therapistName, {color: colors.text}]}>{therapistInfo.firstName} {therapistInfo.lastName}</Text>
                    <View style={{marginTop: 10, flexDirection: "row", justifyContent: 'center', alignItems: 'center'}}>
                        <CustomAvatar color={'#009387'} image={require('../../assets/patien.png')} width={130} height={130}/>
                    </View>
                    <ProgressBar
                        //progress={12 / 100}
                        progress={100 / 100}
                        //color={SwitchColor(12)}
                        color={SwitchColor(100)}
                        style={{borderRadius: 10, margin: 20, height: 10}}/>
                    <View style={{flex: 1, flexDirection: "column"}}>
                        <IconAndText text={therapistInfo.phoneNumber} textSize={16} marginVertical={5}
                            icon={<Fontisto name="phone" size={20} color={colors.icon}/>}/>
                        {/* {therapistInfo.location.formattedAddress !== "" &&
                            <IconAndText text={therapistInfo.location.formattedAddress} textSize={16} marginVertical={5}
                                icon={<Fontisto  name="map-marker-alt" size={20} color={colors.icon}/>}/>
                        } */}
                        <IconAndText text={therapistInfo.email} textSize={16} marginVertical={5}
                            icon={<Fontisto name="email" size={20} color={colors.icon}/>}/>
                    </View>
                    <View style={{marginTop: 20, marginBottom: 5}}>
                        {/* Bouton pour prendre rendez-vous */}
                       {/*  <LinearGradientButton 
                            theme={"User"}
                            textSize={15}
                            onPress={() => setModalVisible(true)}
                            text={"Prendre rendez-vous"}/> */}
                    </View>
                </View>
            </View>
        )
    }

    const DefaultCard = (title, text) => {
        return (
            <View style={styles.infos}>
                <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
                <View style={{marginTop: 10}}>
                    <Text style={[styles.cardTextColor, styles.cardDefaultText]}>{text}</Text>
                </View>
            </View>
        )
    }

    const Rate = () => {
        return (
           DefaultCard("Tarifs et remboursement", "50€, carte vitale acceptée")
        )
    }

    const Specialties = () => {
        return (
            <View style={styles.infos}>
                <Text style={[styles.title, {color: colors.text}]}>Spécialités</Text>
                <View style={{display: 'flex', flexDirection: 'row', margin: 3, flexWrap: 'wrap', marginTop: 10}}>
                    {therapistInfo !== undefined || therapistInfo.specialties.length !== 0
                    ? 
                        therapistInfo.specialties.map((specialitie, key) => {
                            return <Chip key={key} theme={{dark: false}} style={{margin: 2, marginRight: 2}}><Text style={{color: "#555555"}}>{specialitie.name}</Text></Chip>
                        })
                    :
                        <Text>Aucune spécialité renseignée</Text>
                    }
                </View>
            </View>
        )
    }

    const Description = () => {
        return (
            DefaultCard("Description", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")
        )
    }

    const Formation = () => {
        return (
            DefaultCard("Formation", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")
        )
    }

    const ReloadingInformations = async () => {
        setLoader(true)
        const result = await get_Therapist_with_id(therapistId);
        setTherapistInfo(result);
        setLoader(false)
    }

    if (CheckDataError([props.userdata.error]) === true)
        return (
            <Error reloadData={GetData}/>
        )
    else if (CheckDataLoading([props.userdata]) === true)
        return (
            <Loader />
        )
    else  {
        return (
            loader === true
            ?
                <Loader/>
            :
            (
                therapistInfo === null 
                ?
                    <View style={{flex: 1}}>
                        <ArrowBack color={'#009387'} navigation={props.navigation} />
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center", marginHorizontal: 10}}>
                            <View style={{marginBottom: 20}}>
                                <Text style={{color: "#555555", fontWeight: "bold", textAlign: "center", fontSize: 17}}>Une erreur est survenue, les informations du thérapeute n'ont pas été chargées</Text>
                            </View>
                            <LinearGradientButton
                                theme={"User"}
                                textSize={15}
                                onPress={() => ReloadingInformations()}
                                text={"Recharger les informations"}/>
                        </View>
                    </View>
                :
                    <View style={{flex: 1}}>
                        <ScrollView>
                            <ArrowBack color={'#009387'} navigation={props.navigation}/>
                            {SnackBarPopUp()}
                            {ModalTakeAppointment()}
                            {Profile()}
                            {/* {Rate()} */}
                            {Specialties()}
                            {/* {Description()}
                            {Formation()} */}
                        </ScrollView>
                    </View>
            )
        )
    }
}

const mapStateToProps = (state) => ({
    userdata: getUserData(state)
});

export default connect(mapStateToProps)(InformationsTherapist);

const styles = StyleSheet.create({
    body: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    infos: {
        display: 'flex',
        flexDirection: 'column',
        borderBottomColor: "grey",
        padding: 15,
        borderBottomWidth: 0.5,
    },
    therapistName: {
        fontSize: 23,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    }
})