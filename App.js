import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar} from 'react-native';
// import {Icon} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import {StyleSheet, Text} from 'react-native'

import LeaderboardPage from './pages/LeaderboardPage';
import AlarmPage from "./pages/AlarmPage";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="default"/>
      <Text style={styles.mainTitle}>Sleep with the Homies</Text>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName = 'trophy-outline'
            switch(route.name) {
              case 'Leaderboard':
                iconName = 'trophy-sharp'
                break;
              case 'Alarm':
                iconName = 'clock-sharp'
                break;
            }
            return <Icon name='alarm-sharp'/>;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Alarm" component={AlarmPage}/>
        <Tab.Screen name="Leaderboard" component={LeaderboardPage}/>
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
