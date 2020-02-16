import React, { useState } from 'react';
import { Button, TextInput, View, StyleSheet } from 'react-native'



const SignupForm = () => {
   const [email, setEmail] = useState('')
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')

   const onEmailChange = string => setEmail(string)
   const onUsernameChange = string => setUsername(string)
   const onPasswordChange = string => setPassword(string)

   const onFormSubmit = () => {
      console.log('Signing up...')
      // Signup logic
   };

   return (
      <View style={styles.container}>
         <TextInput
            placeholder = "Email"
            value = {email}
            onChangeText = {onEmailChange}
         />
         <TextInput
            placeholder = "Username"
            helperText="This will be visible to everyone else, please be respectful!"
            value = {username}
            onChangeText = {onUsernameChange}
         />
         <TextInput
            placeholder = "Password"
            value = {password}
            onChangeText = {onPasswordChange}
            secureTextEntry = {true}
         />
         <Button
            title="Sign Up"
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

export default SignupForm