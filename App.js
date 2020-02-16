import 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {useState, useEffect} from 'react';
import {StatusBar} from 'react-native';
import {StyleSheet, Text} from 'react-native'

import LeaderboardPage from './pages/LeaderboardPage';
import AlarmPage from "./pages/AlarmPage";
import SettingsPage from "./pages/SettingsPage";

import ReactNativeAN from 'react-native-alarm-notification';
import { DeviceEventEmitter } from 'react-native';
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import { RemoteMongoClient } from "mongodb-stitch-browser-sdk";

const Tab = createBottomTabNavigator();
const APP_ID = 'sleepwithhomies-vfaav';

const fireDate = ReactNativeAN.parseDate(new Date(Date.now() + 7000));
const alarmNotifData = {
	id: "12345",                                  // Required
	title: "My Notification Title",               // Required
	message: "My Notification Message",           // Required
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
	fire_date: fireDate,                          // Date for firing alarm, Required for ReactNativeAN.scheduleAlarm.

	// You can add any additional data that is important for the notification
	// It will be added to the PendingIntent along with the rest of the bundle.
	// e.g.
  	data: { foo: "bar" },
};

const App = () => {
  const [client, setClient] = useState(undefined);
  const [mongoClient, setMongoClient] = useState(undefined);

  loadClient = () => {
    return new Promise ((res, rej) => {
      Stitch.initializeDefaultAppClient(APP_ID).then(client =>{
        setClient(client);
        client.auth.loginWithCredential(new AnonymousCredential()) // TODO oauth
          .then(user => {
            console.log(`successfully logged in anonymously as ${user.id}`);
            const mongoClient = client.getServiceClient(
              RemoteMongoClient.factory,
              "mongodb-atlas"
            );
            setMongoClient(mongoClient);
            res('success');
          })
          .catch(err => {
            console.log(`failed to log in: ${err}`);
            rej(err);
          });
       });
    });
   }

  useEffect(() => {
      console.log("start");
      DeviceEventEmitter.addListener('OnNotificationDismissed', async function(e) {
        const obj = JSON.parse(e);
        console.log(obj);
        stopAlarm();
      });

      DeviceEventEmitter.addListener('OnNotificationOpened', async function(e) {
        const obj = JSON.parse(e);
        console.log(obj);
      });

      loadClient().then(() => {
        console.log('Client loaded successfully');
        //TODO
      })
      .catch(err => {
        console.log(`MongoDB client failed to load: ${err}`);
      });

      return function cleanup() {
        DeviceEventEmitter.removeListener('OnNotificationDismissed');
        DeviceEventEmitter.removeListener('OnNotificationOpened');
        console.log("cleanup");
      };

    }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="default"/>
      <Text style={styles.mainTitle}>Sleep with the Homies</Text>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName = 'trophy-outline'
            switch(route.name) {
              case 'Alarm':
                iconName = 'clock-sharp'
                break;
              case 'Leaderboard':
                iconName = 'trophy-sharp'
                break;
              case 'Settings':
                iconName = 'settings-sharp'
                break;
            }
            return <Icon name='rocket'/>;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Alarm" component={AlarmPage}/>
        <Tab.Screen name="Leaderboard" component={LeaderboardPage} initialParams={{client: client, mongoClient: mongoClient}}/>
        <Tab.Screen name="Settings" component={SettingsPage} initialParams={{client: client, mongoClient: mongoClient}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  mainTitle: {
    textAlign: 'center',
    backgroundColor: '#217aff',
    fontSize: 32,
    paddingVertical: 10
  }
})

export default App;
