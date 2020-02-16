import { Button, TextInput, View, StyleSheet } from 'react-native'
import { UserPasswordCredential } from "mongodb-stitch-react-native-sdk";
import React, { useState } from 'react';

const LoginForm = ({client, mongoClient}) => {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')

   const onEmailChange = string => setEmail(string)
   const onPasswordChange = string => setPassword(string)

   loginWithEmail = async (email, password) => {
    const credential = new UserPasswordCredential(email, password);
    client.auth.loginWithCredential(credential)
      .then(user => {
        console.log(`successfully logged in with id: ${user.id}`)
        console.log(client.auth.user.profile);
      })
      .catch(err => console.error(`login failed with error: ${err}`))
 }

   const onFormSubmit = () => {
      console.log('Logging in...')
      loginWithEmail(email, password)
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