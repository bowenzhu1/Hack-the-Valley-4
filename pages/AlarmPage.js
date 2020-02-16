import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Button,
    TouchableOpacity
} from 'react-native';
import ReactNativeAN from 'react-native-alarm-notification';
import DateTimePicker from '@react-native-community/datetimepicker';

const AlarmPage = () => {
    const [alarmTime, setAlarmTime] = useState(null);
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