import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Title, Text, ProgressBar } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { SwitchColor } from '../../../components/function/SwitchColorProgressBar';
import Fontisto from 'react-native-vector-icons/Fontisto';

import { connect, useDispatch } from 'react-redux';
import { get_user_data_request, get_appointments_request } from '../../../Redux/Actions/Actions';
import { getUserData, getAppointments } from '../../../Redux/Saga/selectors/selector';

/* import { post_appointment } from '../../../../services/appointment_service' */
import Loader from '../../../components/Loader';
import { format, compareAsc } from 'date-fns';
import { fr } from 'date-fns/locale'
import { LogBox } from 'react-native';
import LinearGradientButton from '../../../components/LinearGradientButton'
import IconAndText from '../../../components/IconAndText'
import CustomAvatar from "../../../components/CustomAvatar"

import { CheckDataLoading, CheckDataError } from '../../../components/function/CheckData';

import Error from '../../Error'
import Header from './Components/Header'
import Message from './Components/Message'

const B = (props) => (
  <Text style={{ color: props.color, fontWeight: 'bold' }}>{props.children}</Text>
);

const Home = (props) => {
  const { colors } = useTheme()
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  LogBox.ignoreAllLogs();

  const goTosurvey = () => {
    setVisible(false);
    props.navigation.navigate('Survey');
  };

  const goToappointment = (appointment) => {
    //dispatch(send_appointment(appointment));
    props.navigation.navigate('AppointmentUser', {appointment});
  };
  
  const therapistAvatar = (image) => {
    return (
      <Avatar.Image
        size={55}
        source={require('../../../../assets/png/patien.png')}
      />
    );
  };

  const therapistTextInfo = (infos, date) => {

    const date2 = new Date(date);
    let newDate = format(date2, 'dd LLLL yyyy', { locale: fr });
    const dtDateOnly = new Date(date2.valueOf() + date2.getTimezoneOffset() * 60 * 1000);
    const hour = format(dtDateOnly, 'k:mm');
    return (
      <View style={{ flex: 1.5 }}>
        <View style={{ flex: 3 }}>
          <View style={{ flex: 1, margin: 10, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <IconAndText text={`${newDate} à ${hour}`} textSize={16}
                icon={<Fontisto style={styles.iconsMargin} name="date" size={15} color={colors.icon} />} />
            </View>
            {/* <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Fontisto style={styles.iconsMargin} name="phone" size={15} color="black" />
              <Text style={styles.textColor}>
                {' '} <B>{infos.phoneNumber}</B>
              </Text>
            </View> */}
            <View>
              <ProgressBar
                progress={75 / 100}
                color={SwitchColor(75)}
                style={{ borderRadius: 10, margin: 10, height: 10 }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const pastmeting = (infos, date) => {
    const date2 = new Date(date);
    let newDate = format(date2, 'dd LLLL yyyy', { locale: fr });
    const dtDateOnly = new Date(date2.valueOf() + date2.getTimezoneOffset() * 60 * 1000);
    const hour = format(dtDateOnly, 'k:mm');

    return (
      <View style={{ flex: 1.5 }}>
        <View style={{ flex: 3 }}>
          <View style={{ flex: 1, margin: 10, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <IconAndText text={`${newDate} à ${hour}`} textSize={16}
                icon={<Fontisto style={styles.iconsMargin} name="date" size={15} color={colors.icon} />} />
            </View>
            <View>
              <ProgressBar
                progress={35 / 100}
                //percent
                color={SwitchColor(35)}
                style={{ borderRadius: 10, margin: 10, height: 10 }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const prochain = (futureDate) => {
    const Item = (item) => {

      const name = ` Dr ${item.therapist.firstName} ${item.therapist.lastName}`;
      return (
        <View style={styles.cardInfos}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <CustomAvatar image={require('../../../../assets/patien.png')} borderWidth={0} width={60} height={60}/>
            <Text style={styles.appointmentTitle}>{name}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {therapistTextInfo(item.therapist, item.date)}
          </View>
          <LinearGradientButton theme={"User"} textSize={13} onPress={() => goToappointment(item)} text={'Voir rendez-vous'} />
        </View>
      );
    };

    if (futureDate.length != 0) {
      return futureDate.map((appointment, key) => {
        return (
          <View key={key}>
            {Item(appointment)}
          </View>
        );
      })
    } else {
      return (
        <View style={{ marginTop: 20 }}>
          <Text style={{ textAlign: 'center' }}>Vous n'avez aucun prochain rendez-vous</Text>
        </View>
      );
    }
  };

  const passer = (pasteDate) => {
    if (pasteDate.length != 0) {
      return pasteDate.map((appointment, key) => {
        const name = `Dr ${appointment.therapist.firstName} ${appointment.therapist.lastName}`
        return (
          <View key={key} style={styles.cardInfos}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <CustomAvatar image={require('../../../../assets/patien.png')} borderWidth={0} width={60} height={60}/>
              <Text style={styles.appointmentTitle}>{name}</Text>
            </View>
            {console.log(appointment.therapist)}
            <View style={{ flex: 1, flexDirection: 'row' }}>{pastmeting(appointment.therapist, appointment.date)}</View>
            {/* <LinearGradientButton theme={"User"} textSize={13} text={'Reprendre rendez-vous'} /> */}
          </View>
        );
      });
    } else {
      return (
        <View style={{ marginTop: 20 }}>
          <Text style={{ textAlign: 'center' }}>Vous n'avez aucun dernier rendez-vous</Text>
        </View>
      );
    }
  };

  const custom_sort = (a, b) => {
    return compareAsc(new Date(a.date), new Date(b.date));
  }

  const body = () => {
    let appointments = props.appointments.data.appointments
    appointments.sort(custom_sort);
    let pasteDate = [];
    let futureDate = [];
    let date = new Date().toISOString();
    appointments.map((appointment) => {
      if (appointment.date < date) {
        pasteDate.push(appointment);
      } else {
        futureDate.push(appointment);
      }
    })

    return (
      <View style={{ flex: 1 }}>
        {/* <Button color='red' onPress={() => post_appointment(props.token, '6062e3c175249715b046a664', '6062e30175249715b046a663', '2021-04-02T18:33:02.573Z', '60')} mode="contained">Post RDV</Button> */}
        <View style={{ flex: 2 }}>
          <Title style={[styles.title, { color: colors.text }]}>
            Prochain rendez-vous:
          </Title>
          {prochain(futureDate)}
        </View>
        <Title style={styles.title2}>Derniers rendez-vous:</Title>
        <View style={{ flex: 3 }}>{passer(pasteDate)}</View>
      </View>
    );
  };

  useEffect(() => {
    GetData()
  }, [dispatch]);

  const GetData = () => {
    dispatch(get_user_data_request(false));
    dispatch(get_appointments_request(false));
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
        <Message visible={visible} setVisible={() => setVisible()} goTosurvey={() => goTosurvey()} />
        <ScrollView>
          <View style={styles.container}>
            <View style={{flex: 2}}>
              <Header potentialDisorders={props.userdata.data.user.potentialDisorders} user={props.userdata.data.user} number={props.appointments.data.appointments.length} navigation={props.navigation} />
            </View>
            <View style={{flex: 3}}>{body()}</View>
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

export default connect(mapStateToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    margin: 10,
  },
  title2: {
    color: '#5065D6',
    margin: 10,
    marginTop: 20,
  },
  past: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    borderBottomEndRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 7,
    paddingLeft: 10,
    paddingRight: 10
  },
  avatarView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
  },
  cardInfos: {
    display: 'flex',
    flexDirection: 'column',
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
    padding: 20
  },
  progresbar: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },
  therapistName: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  question: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 40,
    marginBottom: 40,
  },
  appointmentTitle: {
    marginHorizontal: 15,
    fontSize: 18,
  }
});
