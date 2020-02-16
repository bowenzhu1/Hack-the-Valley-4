import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Button, TextInput, View, Text, SectionList} from 'react-native';

const defaultUsers = [{
  title: 'nolifesquad',
  data: [
    { name: 'Aarish', points: 1000 }, 
    { name: 'Bill', points: 6969 }, 
    { name: 'Bowen', points: 420 },
    { name: 'Aydan', points: 0}
  ]
}]

const LeaderboardPage = ({navigation, route}) => {
    const [users, setUsers] = useState(defaultUsers)
    const [code, setCode] = useState('')

    const {client, mongoClient} = route.params

    joinGroup = async (code) => {
      //TODO add user to group and sync with db
      if(mongoClient){
        const groups = mongoClient.db("sleepwithhomies").collection("groups");
        const leaderboards = mongoClient.db("sleepwithhomies").collection("leaderboards");
        const query = {"code" : code};
        const queryBoard = {"groupCode" : code};
        groups.findOne(query)
          .then(doc => {
            if(doc){
              const userId = client.auth.user.id;
  
              leaderboards.findOne(queryBoard)
                .then(doc2 => {
                  console.log(doc2);
                  const updateBoard = {
                    "$set": {
                      "scores": {...doc2.scores, [userId]: 0},
                    }
                  }
                  const queryBoard = {"groupCode" : code};
                  leaderboards.updateOne(queryBoard, updateBoard, {})
                    .then(result => {
                      const { matchedCount, modifiedCount } = result;
                      if(matchedCount && modifiedCount) {
                        console.log('successfully update leaderboard');
                      }
                    })
                    .catch(err => console.error(`failed to update leaderboard: ${err}`));
                })
                .catch(err => console.error(`failed to find leaderboard: ${err}`));
  
              // update group
              const usersArr = doc.users.concat([userId]);
              const update = {
                "$set": {
                  "users": usersArr,
                }
              };
              groups.updateOne(query, update, {})
                .then(result => {
                  const { matchedCount, modifiedCount } = result;
                  if(matchedCount && modifiedCount) {
                    console.log('successfully update groups');
                  }
                })
                .catch(err => console.error(`failed to update: ${err}`));
  
            } else{
              console.log(`couldn't find group, creating one now:`);
              const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
              const charactersLength = characters.length;
              let result = '' //not efficient but whatever
              for(let i = 0; i < 6; i++){
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
              }
              const newGroup = {
                "name": "New Group",
                "code": result,
                "users": [client.auth.user.id],
              };
  
              const newLeaderboard = {
                "groupCode": result,
                "scores": {[client.auth.user.id]: 0},
              };
  
              groups.insertOne(newGroup)
                .then(result => console.log(`success: inserted at ${result.insertedId}`))
                .catch(err => console.error(`Failed to insert item: ${err}`));
  
              leaderboards.insertOne(newLeaderboard)
                .then(result => console.log(`success: inserted at ${result.insertedId}`))
                .catch(err => console.error(`Failed to insert item: ${err}`));
  
            }
          })
          .catch(err => {
            console.log(`failed: ${err}`);
          });
        }
    }
  
    getGroups = (id=client.auth.user.id) => {
      return new Promise ((res, rej) => {
        if(mongoClient){
          const groups = mongoClient.db("sleepwithhomies").collection("groups");
          const query = {"users" : id};
          groups.find(query).toArray()
            .then(docs => {
              console.log(`groups got successfully: ${docs}`)
              const groupArr = [];
              docs.forEach(element => groupArr.push(element));
              res(groupArr);
            })
            .catch(err => {
              rej(Error(`failure getting groups: ${err}`));
            })
        } else{
          rej(Error("No mongoClient?"));
        }
      });
    }
  
    leaveGroup = (code) => {
      if(mongoClient){
        const groups = mongoClient.db("sleepwithhomies").collection("groups");
        const query = {"code" : code};
        groups.findOne(query)
          .then(doc => {
            if(doc){
              let users = doc.users
              users.splice(users.findIndex(element => element == client.auth.user.id), 1)
              const update = {
                "$set": {
                  "users": users,
                }
              };
              groups.updateOne(query, update, {})
                .then(result => {
                  const { matchedCount, modifiedCount } = result;
                  if(matchedCount && modifiedCount) {
                    console.log('success');
                  }
                })
                .catch(err => console.error(`failed to update: ${err}`));
            } else{
              console.log(`couldn't find group`);
            }
          })
          .catch(err => {
            console.log(`failed: ${err}`);
          });
        }
    }
  
    updateLeaderboard = (code, update={}) => {
      if(mongoClient){
        const leaderboards = mongoClient.db("sleepwithhomies").collection("leaderboards");
        const query = {"groupCode" : code};
        leaderboards.findOne(query)
          .then(doc => {
            if(doc){
              let scores = doc.scores;
              for(let [key, value] of Object.entries(update)){
                  scores[key] += value;
              }
              const updateBoard = {...doc, 'scores': scores}
              leaderboards.updateOne(query, updateBoard, {})
                .then(result => {
                  const { matchedCount, modifiedCount } = result;
                  if(matchedCount && modifiedCount) {
                    console.log('success updating leaderboard');
                  }
                })
                .catch(err => console.error(`failed to update: ${err}`));
            }else{
              console.log(`couldn't find leaderboard or no update needed`);
            }
          })
          .catch(err => {
            console.log(`failed: ${err}`);
          });
        }
    }
  
    getUsers = (code) => {
      return new Promise((res, rej) => {
        if(mongoClient){
          const groups = mongoClient.db("sleepwithhomies").collection("groups");
          const leaderboards = mongoClient.db("sleepwithhomies").collection("leaderboards");
          const sleepUsers = mongoClient.db("sleepwithhomies").collection("sleepusers");
          const query = {'code': code};
          const queryBoard = {'groupCode': code};
  
          leaderboards.findOne(queryBoard).then(doc => {
              if(doc){
                let ids = [];
                let boardUsers = [];
                for(let [key, value] of Object.entries(doc.scores)){
                    ids.push(key);
                }
                console.log(`ids:${ids}`);
                const queryUser = {'id': { '$in': ids}};
                sleepUsers.find(queryUser).toArray().then(docs => {
                  docs.forEach(element => boardUsers.push(element));
                  console.log(`success creating boardUsers: ${boardUsers}`)
                  return boardUsers;
                }).then(boardUsers => {
                  console.log(`boardUsers: ${boardUsers}`)
                  groups.findOne(query).then(doc => {
                    const groupUsers = [];
                    doc.users.forEach(user => {
                      const index = boardUsers.findIndex(boardUser => boardUser.id == user);
                      if(index != -1){
                        groupUsers.push(boardUsers[index]);
                      }
                    })
  
                  res({
                      group: groupUsers,
                      leaderboard: boardUsers,
                    });
                  }).catch(err => console.log(`failed finding group: ${err}`));
                }).catch(err => console.log(`error getting users: ${err}`));
              }
            }).catch(err => console.log(`failed finding users from board: ${key}`));
        }else{
          rej("No mongoClient?");
        }
      });
    }

    const onCodeChange = string => setCode(string)

    const onCodeSubmit = () => {
       console.log('Adding/joining leaderboard...')
       // Add leaderboard logic
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

  export default LeaderboardPage;