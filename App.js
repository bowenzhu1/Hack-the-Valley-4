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
import { Stitch, AnonymousCredential, UserPasswordCredential } from "mongodb-stitch-react-native-sdk";
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin'
import { RemoteMongoClient, UserPasswordAuthProviderClient } from "mongodb-stitch-browser-sdk";

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


const App: () => React$Node = () => {
  const [alarms, setAlarms] = useState([]);
  const [client, setClient] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [userId, setUserId] = useState(undefined);
  const [mongoClient, setMongoClient] = useState(undefined);

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
    ReactNativeAN.deleteAlarm(id);
  }

  stopAlarm = () =>{
    ReactNativeAN.stopAlarm();
  }

  getAlarms = () =>{
    return ReactNativeAN.getScheduledAlarms();
  }

  removeNotifications = () => {
    ReactNativeAN.removeAllFiredNotifications();
  }

  loadClient = () => {
    return new Promise ((res, rej) => {
      Stitch.initializeDefaultAppClient(APP_ID).then(client =>{
        setClient(client);
        client.auth.loginWithCredential(new AnonymousCredential()) // TODO oauth
          .then(user => {
            setUser(user);
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
            setUserId(undefined);
            rej(err);
          });
       });
    });
   }

   loginWithEmail = async (email, password) => {
      const credential = new UserPasswordCredential(email, password);
      client.auth.loginWithCredential(credential)
        .then(user => {
          console.log(`successfully logged in with id: ${user.id}`)
          console.log(client.auth.user.profile);
          setUser(user);
        })
        .catch(err => console.error(`login failed with error: ${err}`))
   }

   signupWithEmail = (name, email, password) => {
     client.auth.getProviderClient(UserPasswordAuthProviderClient.factory, "userpass")
        .registerWithEmail(email, password)
        .then(() => console.log("Successfully signed up"))
        .catch(err => console.error("Error registering new user:", err));
      const sleepUsers = mongoClient.db("sleepwithhomies").collection("sleepusers");
      const newUser = {
        'name': name,
        'id': client.auth.user.id,
      };
      sleepUsers.insertOne(newUser)
        .then(result => console.log(`success: inserted at ${result.insertedId}`))
        .catch(err => console.error(`Failed to insert item: ${err}`));
   }

  joinGroup = async (code) => {
    //TODO add user to group and sync with db
    if(mongoClient){
      const groups = mongoClient.db("sleepwithhomies").collection("groups");
      const leaderboards = mongoClient.db("sleepwithhomies").collection("leaderboards");
      const query = {"code" : code};
      const queryBoard = {"groupCode" : code};
      groups.findOne(query)
        .then(doc => {
          if(doc){
            const userId = client.auth.user.id;

            leaderboards.findOne(queryBoard)
              .then(doc2 => {
                console.log(doc2);
                const updateBoard = {
                  "$set": {
                    "scores": {...doc2.scores, [userId]: 0},
                  }
                }
                const queryBoard = {"groupCode" : code};
                leaderboards.updateOne(queryBoard, updateBoard, {})
                  .then(result => {
                    const { matchedCount, modifiedCount } = result;
                    if(matchedCount && modifiedCount) {
                      console.log('successfully update leaderboard');
                    }
                  })
                  .catch(err => console.error(`failed to update leaderboard: ${err}`));
              })
              .catch(err => console.error(`failed to find leaderboard: ${err}`));

            // update group
            const usersArr = doc.users.concat([userId]);
            const update = {
              "$set": {
                "users": usersArr,
              }
            };
            groups.updateOne(query, update, {})
              .then(result => {
                const { matchedCount, modifiedCount } = result;
                if(matchedCount && modifiedCount) {
                  console.log('successfully update groups');
                }
              })
              .catch(err => console.error(`failed to update: ${err}`));

          }else{
            console.log(`couldn't find group, creating one now:`);
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let result = '' //not efficient but whatever
            for(let i = 0; i < 6; i++){
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            const newGroup = {
              "name": "New Group",
              "code": result,
              "users": [client.auth.user.id],
            };

            const newLeaderboard = {
              "groupCode": result,
              "scores": {[client.auth.user.id]: 0},
            };

            groups.insertOne(newGroup)
              .then(result => console.log(`success: inserted at ${result.insertedId}`))
              .catch(err => console.error(`Failed to insert item: ${err}`));

            leaderboards.insertOne(newLeaderboard)
              .then(result => console.log(`success: inserted at ${result.insertedId}`))
              .catch(err => console.error(`Failed to insert item: ${err}`));

          }
        })
        .catch(err => {
          console.log(`failed: ${err}`);
        });
      }
  }

  getGroups = (id=client.auth.user.id) => {
    return new Promise ((res, rej) => {
      if(mongoClient){
        const groups = mongoClient.db("sleepwithhomies").collection("groups");
        const query = {"users" : id};
        groups.find(query).toArray()
          .then(docs => {
            console.log(`groups got successfully: ${docs}`)
            const groupArr = [];
            docs.forEach(element => groupArr.push(element));
            res(groupArr);
          })
          .catch(err => {
            rej(Error(`failure getting groups: ${err}`));
          })
      }else{
        rej(Error("No mongoClient?"));
      }
    });
  }

  leaveGroup = (code) => {
    if(mongoClient){
      const groups = mongoClient.db("sleepwithhomies").collection("groups");
      const query = {"code" : code};
      groups.findOne(query)
        .then(doc => {
          if(doc){
            let users = doc.users
            users.splice(users.findIndex(element => element == client.auth.user.id), 1)
            const update = {
              "$set": {
                "users": users,
              }
            };
            groups.updateOne(query, update, {})
              .then(result => {
                const { matchedCount, modifiedCount } = result;
                if(matchedCount && modifiedCount) {
                  console.log('success');
                }
              })
              .catch(err => console.error(`failed to update: ${err}`));
          }else{
            console.log(`couldn't find group`);
          }
        })
        .catch(err => {
          console.log(`failed: ${err}`);
        });
      }
  }

  updateLeaderboard = (code, update={}) => {
    if(mongoClient){
      const leaderboards = mongoClient.db("sleepwithhomies").collection("leaderboards");
      const query = {"groupCode" : code};
      leaderboards.findOne(query)
        .then(doc => {
          if(doc){
            let scores = doc.scores;
            for(let [key, value] of Object.entries(update)){
                scores[key] += value;
            }
            const updateBoard = {...doc, 'scores': scores}
            leaderboards.updateOne(query, updateBoard, {})
              .then(result => {
                const { matchedCount, modifiedCount } = result;
                if(matchedCount && modifiedCount) {
                  console.log('success updating leaderboard');
                }
              })
              .catch(err => console.error(`failed to update: ${err}`));
          }else{
            console.log(`couldn't find leaderboard or no update needed`);
          }
        })
        .catch(err => {
          console.log(`failed: ${err}`);
        });
      }
  }

  getUsers = (code) => {
    return new Promise((res, rej) => {
      if(mongoClient){
        const groups = mongoClient.db("sleepwithhomies").collection("groups");
        const leaderboards = mongoClient.db("sleepwithhomies").collection("leaderboards");
        const sleepUsers = mongoClient.db("sleepwithhomies").collection("sleepusers");
        const query = {'code': code};
        const queryBoard = {'groupCode': code};

        leaderboards.findOne(queryBoard).then(doc => {
            if(doc){
              let ids = [];
              let boardUsers = [];
              for(let [key, value] of Object.entries(doc.scores)){
                  ids.push(key);
              }
              console.log(`ids:${ids}`);
              const queryUser = {'id': { '$in': ids}};
              sleepUsers.find(queryUser).toArray().then(docs => {
                docs.forEach(element => boardUsers.push(element));
                console.log(`success creating boardUsers: ${boardUsers}`)
                return boardUsers;
              }).then(boardUsers => {
                console.log(`boardUsers: ${boardUsers}`)
                groups.findOne(query).then(doc => {
                  const groupUsers = [];
                  doc.users.forEach(user => {
                    const index = boardUsers.findIndex(boardUser => boardUser.id == user);
                    if(index != -1){
                      groupUsers.push(boardUsers[index]);
                    }
                  })

                res({
                    group: groupUsers,
                    leaderboard: boardUsers,
                  });
                }).catch(err => console.log(`failed finding group: ${err}`));
              }).catch(err => console.log(`error getting users: ${err}`));
            }
          }).catch(err => console.log(`failed finding users from board: ${key}`));
      }else{
        rej("No mongoClient?");
      }
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
