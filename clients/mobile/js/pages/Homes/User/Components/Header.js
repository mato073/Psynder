import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Button,
  Title,
  Text,
  ProgressBar,
} from 'react-native-paper';
import { SwitchColor } from '../../../../components/function/SwitchColorProgressBar';
import Fontisto from 'react-native-vector-icons/Fontisto';
import UserAvatar from './UserAvatar';
import LinearGradientButton from '../../../../components/LinearGradientButton'
import { useTheme } from '@react-navigation/native';

const B = (props) => (
  <Text style={{ color: props.color, fontWeight: 'bold' }}>{props.children}</Text>
  );
  
  const Header = ({potentialDisorders, user, number, navigation}) => {
    const { colors } = useTheme()

    let disorderNumber = potentialDisorders.length;
    if (!disorderNumber)
      disorderNumber = 0
    const name = `${user.firstName} ${user.lastName}`;
    const pourcent = Math.round((disorderNumber / 12) * 100);

    return (
      <View style={{ flex: 1, marginTop: 10 }}>
        {/* {userAvatar()} */}
        <UserAvatar user={user}/>
        <Title style={{color: colors.text, textAlign: 'center', justifyContent: 'center' }}>
          {name}
        </Title>
        <View style={{ flex: 1.5 }}>
          <View style={{ flex: 3 }}>
            <View
              style={{ flex: 1, margin: 10, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <Fontisto
                  style={styles.iconsMargin}
                  name="date"
                  size={20}
                  color={colors.icon}
                />
                <Text>
                  {' '}
                  <B color={colors.text}>{number}</B> rendez-vous{' '}
                </Text>
              </View>
              {/* <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <Fontisto
                  style={styles.iconsMargin}
                  name="map"
                  size={20}
                  color={colors.icon}
                />
                <Text> ville: Paris 75018 France</Text>
              </View> */}
            </View>
          </View>
        </View>
        <View style={styles.question}>
          <Text style={{textAlign: 'center' }}>
            {pourcent < 100
            ?
              "Terminer pour avoir un meilleur matching"
            : "Recommencer pour avoir un meilleur matching"
            }
          </Text>
          <View style={styles.progresbar}>
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  color: colors.text,
                  borderRadius: 10,
                  textAlign: 'center',
                  justifyContent: 'center',
                }}>
                {pourcent}%
              </Text>
              <ProgressBar
                progress={pourcent / 100}
                color={SwitchColor(pourcent)}
                style={{ borderRadius: 10, margin: 10, height: 10 }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'column', flex: 1, marginHorizontal: 10 }}>
            <LinearGradientButton theme={"Purple"} textSize={13} 
              onPress={() => navigation.navigate('Survey')} 
              text={pourcent < 100 ? 'Commencer le questionnaire' : 'Recommencer le questionnaire'} />
          </View>
        </View>
      </View>
    );
  };

  export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    //textAlign: "center"
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
  modalView: {
    position: 'absolute',
    marginHorizontal: 15,
    backgroundColor: 'white',
    flex: 1,
    borderBottomEndRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
});
