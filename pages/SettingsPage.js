import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Button} from 'react-native';

import LoginForm from '../forms/LoginForm'
import SignupForm from '../forms/SignupForm'

const SettingsPage = () => {
    const [login, setLogin] = useState(true)

    return (
        <SafeAreaView>
          <Button style={styles.button} title='Login' onPress={() => setLogin(true)}/>
          <Button style={styles.button} title='Sign Up' onPress={() => setLogin(false)}/>
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
  },
  button: {
    marginHorizontal: 10,
    marginVertical: 10
  }
});

export default SettingsPage;