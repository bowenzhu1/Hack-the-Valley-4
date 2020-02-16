/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import ReactNativeAN from 'react-native-alarm-notification';
import { DeviceEventEmitter } from 'react-native';
import { Stitch, AnonymousCredential, GoogleRedirectCredential } from "mongodb-stitch-react-native-sdk";

const APP_ID = 'STITCHAPP'; // TODO REPLACE WITH AYDAN's THING

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


const App: () => React$Node = () => {
  const [alarms, setAlarms] = useState([]);
  const [client, setClient] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [userId, setUserId] = useState(undefined);

  setAlarm = (time) => {
    //TODO sync alarm data with mongodb, this is only local side
    const data = {
    	id: Math.floor(Math.random() * Math.floor(10000)),                                  // Required
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
    	fire_date: ReactNativeAN.parseDate(new Date(Date.now() + time)),                          // Date for firing alarm, Required for ReactNativeAN.scheduleAlarm.
    };
  };

  deleteAlarm = (id) => {
    //TODO sync with user's group
    ReactNativeAN.deleteAlarm(id);
  }

  stopAlarm = () =>{
    ReactNativeAN.stopAlarm();
  }

  getAlarms = () =>{
    // TODO get the alarms from the user's group(s) from mongodb and sync them locally
    return ReactNativeAN.getScheduledAlarms(); // TODO also remove this garbage
  }

  removeNotifications = () => {
    ReactNativeAN.removeAllFiredNotifications();
  }

  loadClient = () => {
    Stitch.initializeDefaultAppClient(APP_ID).then(client =>{
      setClient(client);
      client.auth.loginWithCredential(new AnonymousCredential()) // TODO oauth
        .then(user => {
          console.log('successfully logged in anonymously as ${user.id}');
          setUserId(user.id);
          setUserId(client.auth.user.id);
        })
        .catch(err => {
          console.log('failed to log in: ${err}');
          setUserId(undefined);
        });
     });
   }


     //  const client = Stitch.hasAppClient(APP_ID)
     //    ? Stitch.getAppClient(APP_ID)
     //    : Stitch.initializeAppClient(APP_ID);
     //
     //  if (client.auth.hasRedirectResult()) {
     //    client.auth.handleRedirectResult().catch(console.error);
     //    console.log("Processed redirect result.")
     //  }
     //
     // if (client.auth.isLoggedIn) {
     //   // The user is logged in. Add their user object to component state.
     //   setUser = client.auth.user;
     // } else {
     //   // The user has not yet authenticated. Begin the Google login flow.
     //   const credential = new GoogleRedirectCredential();
     //   client.auth.loginWithRedirect(credential);
     // }
    //}



  joinGroup = (id) => {
    //TODO add user to group and sync with db
  }

  leaveGroup = () => {
    //TODO remove user from group and sync with db
  }

  useEffect(() => {
      console.log("start");
      DeviceEventEmitter.addListener('OnNotificationDismissed', async function(e) {
        const obj = JSON.parse(e);
        console.log(obj);
        stopAlarm();
      });
      ReactNativeAN.scheduleAlarm(alarmNotifData);
      //ReactNativeAN.sendNotification(alarmNotifData);

      DeviceEventEmitter.addListener('OnNotificationOpened', async function(e) {
        const obj = JSON.parse(e);
        console.log(obj);
      });

      loadClient();

      return function cleanup() {
        DeviceEventEmitter.removeListener('OnNotificationDismissed');
        DeviceEventEmitter.removeListener('OnNotificationOpened');
        console.log("cleanup");
      };

    }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
