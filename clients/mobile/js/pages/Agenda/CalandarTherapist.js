import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { addDays, format, getDate, isSameDay, isToday, startOfWeek, subDays, addMonths, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale'
import { get_selected_appointment } from '../../services/appointment_service'
import { useTheme } from '@react-navigation/native';

const B = (props) => <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>

const CalandarTherapis = ({ date, onchange, setWeekDate }) => {
  const { colors } = useTheme()

  const [week, setWeek] = useState([]);
  const [nextWeek, setNextWeek] = useState();

  const getWeekDays = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 })
    let i = 0;
    const final = [];

    while (i < 7) {
      const date = addDays(start, i);
      final.push({
        formatted: format(date, 'EEE', { locale: fr }),
        date,
        day: getDate(date)
      });
      i++;
    }
    setWeekDate([start, final[6].date]);
    return (final);
  }

  useEffect(() => {
    const weekDays = getWeekDays(date);
    setWeek(weekDays);
  }, [setNextWeek, date]);


  const newMonth = (pos) => {
    let newDate;
    if (pos) {
      newDate = addMonths(date, +1);
      newDate = startOfMonth(newDate);
      onchange(newDate);
      setNextWeek(pos);
    } else {
      newDate = addMonths(date, -1)
      newDate = startOfMonth(newDate);
      onchange(newDate);
      setNextWeek(pos);
    }
  }

  const month = () => {
    let month = format(date, 'LLLL', { locale: fr });
    month = month.charAt(0).toUpperCase() + month.slice(1)
    const year = format(date, 'uuuu')
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <TouchableOpacity
          onPress={() => newMonth(false)}>
          <MaterialIcons name="keyboard-arrow-left" color={'#1797e8'} size={35} />
          {/* <Ionicons name="arrow-back" color={'#1797e8'} size={35} /> */}
        </TouchableOpacity>
        <Text style={[styles.curentMonth, {color: colors.text}]}> {`${month} ${year}`} </Text>
        <TouchableOpacity
          onPress={() => newMonth(true)}>
          <MaterialIcons name="keyboard-arrow-right" color={'#1797e8'} size={35} />
        </TouchableOpacity>
      </View>
    );
  }
  const display = () => {
    return week.map((day, key) => {
      const textStyle = [styles.label];
      const sameDay = isSameDay(day.date, date);
      const touchable = [styles.touchable]
      if (sameDay) {
        textStyle.push(styles.selectedLabel);
        touchable.push(styles.selectedTouchabel);
      }
      else if (!sameDay && isToday(day.date)) {
        textStyle.push(styles.selectedLabel);
        touchable.push(styles.selectedTouchabe2)
      }
      else 
        textStyle.push({color: colors.text});
      return (
        <View style={styles.weelDayItems} key={day.formatted} >
          <Text style={styles.weelDayText}>{day.formatted}</Text>
          <TouchableOpacity onPress={() => onchange(day.date)} style={touchable}>
            <Text style={textStyle}>{day.day}</Text>
          </TouchableOpacity>
        </View >
      )
    })
  }

  const changeWeek = (pos) => {
    const start = startOfWeek(date, { weekStartsOn: 1 })
    let newDate;
    if (pos) {
      newDate = addDays(start, 7);
      onchange(newDate);
      setNextWeek(pos);
    } else {
      newDate = subDays(start, 7);
      onchange(newDate);
      setNextWeek(pos);
    }
  }

  const changeButton = () => {

    return (
      <View style={styles.changeWeek}>
        <TouchableOpacity
          onPress={() => changeWeek(false)}>
          <MaterialIcons name="keyboard-arrow-left" color={'#1797e8'} size={35} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeWeek(true)}>
          <MaterialIcons name="keyboard-arrow-right" color={'#1797e8'} size={35} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.root, {backgroundColor: colors.background}]}>
      <View style={{ flex: 1 }}>
        {month()}
      </View>
      <View style={styles.container} style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
        {display()}
      </View>
      <View style={{ flex: 1 }}>
        {changeButton()}
      </View>
    </SafeAreaView>
  );
};

export default CalandarTherapis;

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10
  },
  curentMonth: {
    textAlign: 'center',
    fontSize: 20
  },
  card: {
    display: 'flex',
    flexDirection: 'row'
  },
  weelDayText: {
    color: 'grey',
    marginBottom: 5,
    fontSize: 15,
  },
  label: {
    fontSize: 15,
    color: 'black',
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
  selectedTouchabel: {
    backgroundColor: "#1797e8"
  },
  selectedTouchabe2: {
    backgroundColor: "grey"
  },
  weelDayItems: {
    display: 'flex',
    width: '13%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10
  }
})