import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Button} from 'react-native';

import LoginForm from '../forms/LoginForm'
import SignupForm from '../forms/SignupForm'

const SettingsPage = () => {
    const [login, setLogin] = useState(true)

    return (
        <SafeAreaView>
          <Button title='Login' onPress={() => setLogin(true)}/>
          <Button title='Sign Up' onPress={() => setLogin(false)}/>
          <View>
            {login ? <LoginForm style={styles.signupForm}/> : <SignupForm style={styles.signupForm}/>}
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