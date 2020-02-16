import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Button} from 'react-native';

import LoginForm from '../forms/LoginForm'
import SignupForm from '../forms/SignupForm'

const SettingsPage = ({navigation, route}) => {
    const [login, setLogin] = useState(true)
    const {client, mongoClient} = route.params
    return (
        <SafeAreaView>
          <Button title='Login' onPress={() => setLogin(true)}/>
          <Button title='Sign Up' onPress={() => setLogin(false)}/>
          <View>
            {login ? 
                <LoginForm client={client} mongoClient={mongoClient} style={styles.signupForm}/> : 
                <SignupForm client={client} mongoClient={mongoClient} style={styles.signupForm}/>
            }
          </View>
        </SafeAreaView>  
    )
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 30,
    color: '#000000',
    textAlign: 'center',
  },
  signupForm: {
      paddingHorizontal: 10
  }
});

export default SettingsPage;