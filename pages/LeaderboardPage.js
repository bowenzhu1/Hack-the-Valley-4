import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    SectionList
} from 'react-native';

const defaultUsers = [{
  title: 'nolifesquad',
  data: [
    { name: 'Aarish', points: 1000 }, 
    { name: 'Bill', points: 6969 }, 
    { name: 'Bowen', points: 420 },
    { name: 'Aydan', points: 0}
  ]
}]

const LeaderboardPage = () => {
    const [users, setUsers] = useState(defaultUsers)

    // const renderLeaderboard = () => {
    //   return users
    //     .sort((a, b) => a.points < b.points)
    //     .map(user => {
    //         return (
    //         <View style={{flexDirection: 'row', contentAlign: 'space-between'}}>
    //             <Text style={styles.leaderboardName}>{user.name}</Text>
    //             <Text style={styles.leaderboardScore}>{user.points}</Text>
    //         </View>
    //         )
    //     })
    // }
    
    return (
        <SafeAreaView>
          <SectionList
            sections={users}
            keyExtractor={(item, index) => item + index}
            renderItem={({item}) => {
              return (<View style={styles.itemView}>
                          <Text style={styles.leaderboardName}>{item.name}</Text>
                          <Text style={styles.leaderboardScore}>{item.points}</Text>
                      </View>)
            }}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionTitle}>{title}</Text>
            )}
          />
        </SafeAreaView>  
    )
}

const styles = StyleSheet.create({
    scrollView: {
      // backgroundColor: Colors.lighter,
    },
    body: {
      // backgroundColor: Colors.white,
    },
    sectionContainer: {
      marginTop: 5,
      paddingHorizontal: 30,
    },
    sectionTitle: {
      fontSize: 24,
      color: '#000000',
      paddingLeft: 15,
      paddingVertical: 10
    },
    leaderboardName: {
      fontSize: 18,
      fontWeight: '400',
      color: '#000000',
      flex: 1,
      textAlign: 'left',
      paddingLeft: 25
    },  
    leaderboardScore: {
      fontSize: 18,
      fontWeight: '400',
      color: '#000000',
      flex: 1,
      textAlign: 'right',
      paddingRight: 25
    },
    itemView: {
      flexDirection: 'row',
      alignContent: 'space-between', 
      backgroundColor: '#ffffff',
      marginVertical: 6,
      marginHorizontal: 8,
      paddingVertical: 8
    }
  });

  export default LeaderboardPage;