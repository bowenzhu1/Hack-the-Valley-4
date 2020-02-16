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
import Puzzle from "./pages/Puzzle"

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
    fontSize: 32,
    paddingVertical: 10
  }
})

export default App;
