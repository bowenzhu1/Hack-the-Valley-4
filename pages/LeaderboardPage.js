import React, {useState, useEffect} from 'react';
import {withMongoDB} from '../stitch';
import {SafeAreaView, StyleSheet, Button, TextInput, View, Text, SectionList} from 'react-native';

const defaultUsers = [{
  title: 'nolifesquad',
  data: [
    { name: 'Aarish', points: 10000 }, 
    { name: 'Bill', points: 6009 }, 
    { name: 'Bowen', points: 4200 },
    { name: 'Aydan', points: 0}
  ]
}]

const LeaderboardPage = ({mongodb}) => {
    const [users, setUsers] = useState(defaultUsers)
    const [code, setCode] = useState('')

    useEffect(() => {
      onCodeSubmit();
    }, [])

    const onCodeChange = string => setCode(string)

    const onCodeSubmit = async () => {
      //  ccode = "YP2yX6"
      //  console.log('Adding/joining leaderboard...')
      //  await mongodb.joinGroup(ccode)
      //  const data = await mongodb.updateLeaderboard(ccode)
      //  let users = await mongodb.getUsers(ccode)
      //  users = users.group.map(user => user.name)
      //  let scores = []
      //  for (const score of Object.entries(data.scores)) {
      //    scores.push(score[1])
      //  }
      //  let userScores = []
      //  for (let i = 0; i < users.length; i++) {
      //     userScores[i] = {name: users[i], points: scores[i]}
      //  }
      //  userScores.sort((a, b) => a.points < b.points)       
      //  setUsers([{title: 'nolifesquad', data: userScores}])
    };
 
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
          <View style={styles.inputContainer}>
            <TextInput
              placeholder = "Leaderboard Code"
              value = {code}
              onChangeText = {onCodeChange}
            />
            <Button title='Add/Create Leaderboard' onPress={onCodeSubmit}/>
          </View>
        </SafeAreaView>  
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 5,
      paddingHorizontal: 30,
    },
    inputContainer: {
      marginHorizontal: 15,
      marginTop: 10
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

  export default withMongoDB(LeaderboardPage);