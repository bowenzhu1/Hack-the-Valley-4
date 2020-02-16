import { Button, TextInput, View, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import { UserPasswordAuthProviderClient } from "mongodb-stitch-browser-sdk";

const SignupForm = ({client, mongoClient}) => {
   const [email, setEmail] = useState('')
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')

   const onEmailChange = string => setEmail(string)
   const onUsernameChange = string => setUsername(string)
   const onPasswordChange = string => setPassword(string)

   signupWithEmail = (name, email, password) => {
    client.auth.getProviderClient(UserPasswordAuthProviderClient.factory, "userpass")
       .registerWithEmail(email, password)
       .then(() => console.log("Successfully signed up"))
       .catch(err => console.error("Error registering new user:", err));
     const sleepUsers = mongoClient.db("sleepwithhomies").collection("sleepusers");
     const newUser = {
       'name': name,
       'id': client.auth.user.id,
     };
     sleepUsers.insertOne(newUser)
       .then(result => console.log(`success: inserted at ${result.insertedId}`))
       .catch(err => console.error(`Failed to insert item: ${err}`));
    }

   const onFormSubmit = () => {
      console.log('Signing up...')
      signupWithEmail(username, email, password)
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