import { Button, TextInput, View, StyleSheet } from 'react-native'
import React, { useState } from 'react';

const LoginForm = () => {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')

   const onEmailChange = string => setEmail(string)
   const onPasswordChange = string => setPassword(string)

   const onFormSubmit = () => {
      console.log('Logging in...')
      // Login logic
   };

   return (
      <View style={styles.container}>
         <TextInput
            placeholder = "Email"
            value = {email}
            onChangeText = {onEmailChange}
         />
         <TextInput
            placeholder = "Password"
            value = {password}
            onChangeText = {onPasswordChange}
            secureTextEntry = {true}
         />
         <Button
            title="Login"
            onPress={onFormSubmit}
         />
      </View>
   )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 10
    }
});

export default LoginForm