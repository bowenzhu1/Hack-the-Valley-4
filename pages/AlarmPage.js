import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import ReactNativeAN from 'react-native-alarm-notification';
import {SafeAreaView, StyleSheet, View, Text, TouchableOpacity} from 'react-native';

// setAlarm = (time) => {
//   //TODO sync alarm data with mongodb, this is only local side
//   const data = {
//     id: Math.floor(Math.random() * Math.floor(10000)),                                  // Required
//     title: "Alarm set for ${}",               // Required
//     message: "Wake up!",           // Required
//     channel: "hackthevalley",                     // Required. Same id as specified in MainApplication's onCreate method
//     ticker: "My Notification Ticker",
//     auto_cancel: true,                            // default: true
//     vibrate: true,
//     vibration: 100,                               // default: 100, no vibration if vibrate: false
//     small_icon: "ic_launcher",                    // Required
//     large_icon: "ic_launcher",
//     play_sound: true,
//     sound_name: null,                             // Plays custom notification ringtone if sound_name: null
//     color: "red",
//     schedule_once: true,                          // Works with ReactNativeAN.scheduleAlarm so alarm fires once
//     tag: 'some_tag',
//     fire_date: ReactNativeAN.parseDate(new Date(Date.now() + time)),                          // Date for firing alarm, Required for ReactNativeAN.scheduleAlarm.
//   };
// };

// deleteAlarm = (id) => {
//   ReactNativeAN.deleteAlarm(id);
// }

// stopAlarm = () =>{
//   ReactNativeAN.stopAlarm();
// }

// getAlarms = () =>{
//   return ReactNativeAN.getScheduledAlarms();
// }

// removeNotifications = () => {
//   ReactNativeAN.removeAllFiredNotifications();
// }

const AlarmPage = () => {
    const [hr, setHr] = useState('00');
    const [min, setMin] = useState('00');
    const [show, setShow] = useState(false);

    const handleAlarmChange = () => {
      let time = new Date(Date.now());
      time.setDate(time.getDate() + 1);
      time.setHours(parseInt(hr), parseInt(min), 0);
      time = ReactNativeAN.parseDate();
    }

    const handleTimeChange = (event, date) => {
      if (date) {
        setHr(String(date.getHours()).padStart(2, '0'));
        setMin(String(date.getMinutes()).padStart(2, '0'));
        setShow(false);
      }
    }

    return (
        <SafeAreaView>
          <View style={styles.container}>
            <Text style={styles.sectionTitle}>Set your daily alarm!</Text>
            <TouchableOpacity onPress={() => setShow(true)}>
              <Text style={styles.time}>{`${hr}:${min}`}</Text>
            </TouchableOpacity>
          </View>
          {
            show &&
            (<DateTimePicker
              value={new Date()}
              mode='time'
              display='clock'
              is24Hour={true}
              onChange={handleTimeChange}
            />)
          }
        </SafeAreaView>  
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center'
  },
  sectionTitle: {
    fontSize: 30,
    color: '#000000',
    textAlign: 'center',
  },
  time: {
    fontSize: 130,
    textAlign: 'center'
  }
});

export default AlarmPage;