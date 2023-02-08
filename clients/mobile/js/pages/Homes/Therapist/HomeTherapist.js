import React, { useEffect, useState } from 'react';

import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Button, Card, Title, Text } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

import Fontisto from 'react-native-vector-icons/Fontisto';

import { connect, useDispatch } from 'react-redux';
import { send_appointment, get_user_data_request, get_appointments_request } from '../../../Redux/Actions/Actions';

import { CheckDataLoading, CheckDataError } from '../../../components/function/CheckData';
import Loader from '../../../components/Loader';
import IconAndText from '../../../components/IconAndText'
import CustomAvatar from "../../../components/CustomAvatar"
import Error from '../../Error'
import TabBarHeight from "../../../components/TabBarHeight"
import { format, compareAsc, isToday } from 'date-fns';
import { LogBox } from 'react-native';
import LinearGradientButton from '../../../components/LinearGradientButton'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons';

//Import state
import { getUserData, getAppointments } from '../../../Redux/Saga/selectors/selector';

const HomeTherapist = (props) => {

  const dispatch = useDispatch();

  const { colors } = useTheme()

  LogBox.ignoreAllLogs();

  const goToappointment = (appointment) => {
    //dispatch(send_appointment(appointment));
    props.navigation.navigate('AppointmentTherapist', {appointment});
  };

  const therapistAvatar = (image) => {
    return (
      <View style={styles.avatarView}>
        <Avatar.Image size={130} source={require('../../../../assets/patien.png')} />
      </View>
    )
  }

  const userAvatar = () => {
    if (!props.userdata.data.therapist.image) {
      return (
        <View style={styles.avatarView}>
          <Avatar.Image size={130} source={require('../../../../assets/png/patien.png')} />
        </View>
      )
    } else {
      <View style={styles.avatarView}>
        <Avatar.Image size={130} source={{ uri: !props.userdata.data.user.image }} />
      </View>
    }
  }

  const header = () => {
    const name = `${props.userdata.data.therapist.firstName} ${props.userdata.data.therapist.lastName}`
    return (
      <View style={styles.header}>
        <View style={styles.test}>
          {userAvatar()}
        </View>
        <View>
          <Title style={{color: colors.text, textAlign: 'center'}}>Dr {name} </Title>
        </View>
      </View>
    );
  }

  const therapistTextInfoDate = (date) => {
     const date2 = new Date(date);
     const dtDateOnly = new Date(date2.valueOf() + date2.getTimezoneOffset() * 60 * 1000);
     const hour = format(dtDateOnly, 'k:mm');
 
      return (
        <IconAndText text={hour} textSize={16}
          icon={<AntDesign name="user" size={16} color={colors.icon} />} />
      )
  }


  const therapistTextInfo = (date) => {
    const date2 = new Date(date);
    const dtDateOnly = new Date(date2.valueOf() + date2.getTimezoneOffset() * 60 * 1000);
    const hour = format(dtDateOnly, 'k:mm');

    return (
      <View style={{ flex: 1, margin: 10, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <IconAndText text={hour} textSize={16}
            icon={<Fontisto name="date" size={15} color={colors.icon} />} />
        </View>
      </View>
    )
  }

  const prochain = (todayDates) => {

    if (todayDates.length != 0) {
      return todayDates.map((infos, key) => {
        const name = `${infos.user.firstName} ${infos.user.lastName}`;

        return (
          <View key={key} style={styles.cardInfos}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <CustomAvatar image={require('../../../../assets/patien.png')} borderWidth={0} width={60} height={60}/>
              <Text style={styles.appointmentTitle}>{name}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              {therapistTextInfo(infos.date)}
            </View>
            <LinearGradientButton theme={"Therapist"} textSize={13} onPress={() => goToappointment(infos)} text={'Voir Rendez-vous'} />
          </View>
        );
      })
    } else {
      return (
        <View>
          <Text style={{ textAlign: 'center', color: colors.text, marginTop: 10 }}>Pas de rendez-vous aujourd'hui </Text>
        </View>
      );
    }
  }

  const custom_sort = (a, b) => {
    return compareAsc(new Date(a.date), new Date(b.date));
  }

  const body = () => {
    const appointments = props.appointments.data.appointments;
    const todayDates = [];
    if (appointments !== null || appointments !== undefined || appointments !== []) {
      appointments.sort(custom_sort);
      appointments.map((appointment) => {
        if (isToday(new Date(appointment.date))) {
          todayDates.push(appointment)
        }
      })
    }

    return (
      <View style={styles.body}>
        <View>
          <Title style={styles.title2}>Vos rendez-vous aujourd'hui:</Title>
          {prochain(todayDates)}
        </View>
      </View>
    );
  }

  const footer = () => {
    return (
      <View style={styles.footer}>
        <Text>footer</Text>
      </View>
    );
  }

  useEffect(() => {
    GetData()
  }, [dispatch]);

  const GetData = () => {
    dispatch(get_user_data_request(true));
    dispatch(get_appointments_request(true));
  }
  
  if (CheckDataError([props.userdata.error, props.appointments.error]) === true)
    return (
      <Error reloadData={GetData}/>
    )
  else if (CheckDataLoading([props.userdata, props.appointments]) === true)
    return (
      <Loader />
    )
  else {
    return (
      <View>
        <ScrollView>
          <View styles={styles.container}>
            <View style={{ flex: 2 }}>
              {header()}
            </View>
            <View style={{ flex: 3 }}>
              {body()}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userdata: getUserData(state),
  appointments: getAppointments(state)
});

export default connect(mapStateToProps)(HomeTherapist);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  header: {

  },
  body: {
    marginTop: 15,
  },
  cardInfos: {
    display: 'flex',
    flexDirection: 'column',
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
    padding: 20
  },
  avatarView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  test: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  meting: {
    display: 'flex',
    flexDirection: 'column',
  }, 
  title: {
    margin: 10,
    color: 'black'
  },
  title2: {
    color: '#5065D6',
    margin: 10,
    marginTop: 20
  },
  past: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    borderBottomEndRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 5,

  },
  avatarView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    display: 'flex',
    justifyContent: 'center'
  },
  progresbar: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: "center",
  },
  therapistName: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  question: {
    backgroundColor: 'white',
    marginRight: 10,
    marginLeft: 10,
    marginTop: 40,
    marginBottom: 40,
    elevation: 5,
  },
  appointmentTitle: {
    marginHorizontal: 15,
    fontSize: 18,
  }
})