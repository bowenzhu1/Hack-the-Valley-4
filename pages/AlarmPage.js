import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text
} from 'react-native';

const AlarmPage = () => {
    return (
        <SafeAreaView>
          <Text style={styles.mainTitle}>Sleep with the Homies</Text>
          <ScrollView style={styles.scrollView}>
            <View style={styles.body}>
              <Text style={styles.sectionTitle}>nolifesquad</Text>
              <View style={styles.sectionContainer}>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>  
    )
}

const styles = StyleSheet.create({

});

export default AlarmPage;