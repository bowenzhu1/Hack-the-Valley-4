import 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {useState, useEffect} from 'react';
import {StatusBar} from 'react-native';
import {StyleSheet, Text, Image} from 'react-native'

import LeaderboardPage from './pages/LeaderboardPage';
import AlarmPage from "./pages/AlarmPage";
import SettingsPage from "./pages/SettingsPage";
import Trophy from './pages/assets/trophy.png'
import Timer from './pages/assets/timer.png'
import Gear from './pages/assets/gear.png'

const Tab = createBottomTabNavigator();

import MongoDB, { MongoContext } from './stitch'

import ReactNativeAN from 'react-native-alarm-notification';
import { DeviceEventEmitter } from 'react-native';

const App: () => React$Node = () => {

  return (
    <MongoContext.Provider value={new MongoDB()}>
      <NavigationContainer>
        <StatusBar barStyle="default"/>
        <Text style={styles.mainTitle}>Sleep with the Homies</Text>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let icon
              switch(route.name) {
                case 'Alarm':
                  icon = <Image source={Timer} style={{width: 25, height: 25}}/>
                  break;
                case 'Leaderboard':
                  icon = <Image source={Trophy} style={{width: 25, height: 25}}/>
                  break;
                case 'Settings':
                  icon = <Image source={Gear} style={{width: 25, height: 25}}/>
                  break;
              }
              return icon;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Alarm" component={AlarmPage}/>
          <Tab.Screen name="Leaderboard" component={LeaderboardPage} />
          <Tab.Screen name="Settings" component={SettingsPage} />
        </Tab.Navigator>
      </NavigationContainer>
    </MongoContext.Provider>
  );
};


const styles = StyleSheet.create({
  mainTitle: {
    textAlign: 'center',
    backgroundColor: '#217aff',
    fontSize: 34,
    paddingVertical: 10
  }
})

export default App;
