import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import ReactNativeAN from 'react-native-alarm-notification';
import { DeviceEventEmitter } from 'react-native';
import Puzzle from './Puzzle'

const AlarmPage = ({navigation}) => {
    // const [hr, setHr] = useState('00');
    // const [min, setMin] = useState('00');
    // const [show, setShow] = useState(false);
    const [obj, setObj] = useState({hr: '00', min: '00', show: false})
    const [showGame, setShowGame] = useState(false)

    setAlarm = (time) => {
      const data = {
        id: "1",                                  // Required
        title: "Alarm set for ${}",               // Required
        message: "Wake up!",           // Required
        channel: "hackthevalley",                     // Required. Same id as specified in MainApplication's onCreate method
        ticker: "My Notification Ticker",
        auto_cancel: true,                            // default: true
        vibrate: true,
        vibration: 100,                               // default: 100, no vibration if vibrate: false
        small_icon: "ic_launcher",                    // Required
        large_icon: "ic_launcher",
        play_sound: true,
        sound_name: null,                             // Plays custom notification ringtone if sound_name: null
        color: "red",
        schedule_once: true,                          // Works with ReactNativeAN.scheduleAlarm so alarm fires once
        tag: 'some_tag',
        fire_date: time,                          // Date for firing alarm, Required for ReactNativeAN.scheduleAlarm.
      };
      ReactNativeAN.scheduleAlarm(data)
    };
  
    deleteAlarm = (id) => {
      ReactNativeAN.deleteAlarm(id);
    }
  
    stopAlarm = () => {
      ReactNativeAN.stopAlarm();
      setShowGame(false)
    }
  
    getAlarms = () => {
      return ReactNativeAN.getScheduledAlarms();
    }
  
    removeNotifications = () => {
      ReactNativeAN.removeAllFiredNotifications();
    }
  
    useEffect(() => {
        console.log("start");
        DeviceEventEmitter.addListener('OnNotificationDismissed', async function(e) {
          const obj = JSON.parse(e);
          console.log(obj);
          stopAlarm();
        });
  
        DeviceEventEmitter.addListener('OnNotificationOpened', async function(e) {
          console.log('YEHEHEEE')
          setShowGame(true)
        });
  
        return function cleanup() {
          DeviceEventEmitter.removeListener('OnNotificationDismissed');
          DeviceEventEmitter.removeListener('OnNotificationOpened');
          console.log("cleanup");
        };
      }, []);

    const handleTimeChange = (event, date) => {
      if (date) {
        deleteAlarm("1")
        let time = new Date(Date.now());
        // time.setDate(time.getDate() + 1);
        time.setHours(date.getHours(), date.getMinutes(), 0);
        time = ReactNativeAN.parseDate(time);
        setAlarm(time)

        setObj({hr: String(date.getHours()).padStart(2, '0'), min: String(date.getMinutes()).padStart(2, '0'), show: false})
      }
    }

    if (showGame) {
      console.log("YEEEYEHEEEE 2")
      return (
        <View style={{height: '100%'}}>
          <Puzzle whenEnded={stopAlarm}/>
        </View>
      )
    } else {
      return (
        <SafeAreaView>
          <View style={styles.container}>
            <Text style={styles.sectionTitle}>Set your daily alarm!</Text>
            <TouchableOpacity onPress={() => setObj({...obj, show: true})}>
              <Text style={styles.time}>{`${obj.hr}:${obj.min}`}</Text>
            </TouchableOpacity>
          </View>
          {
            obj.show &&
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