import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Button
} from 'react-native';

import SignupForm from '../forms/SignupForm'
import LoginForm from '../forms/LoginForm'

const SettingsPage = () => {
    const [login, setLogin] = useState(true)

    return (
        <SafeAreaView>
          {/* <View style={{flexDirection: 'horizontal', alignContent: 'center'}}> */}
              <Button title='Login' onPress={() => setLogin(true)} style={{flex: 1}}/>
              <Button title='Sign Up' onPress={() => setLogin(false)} style={{flex: 1}}/>
          {/* </View> */}
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
  switchButtons: {

  }
});

export default SettingsPage;