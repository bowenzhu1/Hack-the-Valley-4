import { Stitch, AnonymousCredential, UserPasswordCredential } from "mongodb-stitch-react-native-sdk";
import { RemoteMongoClient, UserPasswordAuthProviderClient } from "mongodb-stitch-browser-sdk";

const APP_ID = 'sleepwithhomies-vfaav';

class MongoDB {

    constructor(){
        this.client = undefined;
        this.mongoClient = undefined;
        this.loadClient().then(() => {
            //S
        });
    }

    loadClient = () => {
        return new Promise ((res, rej) => {
        Stitch.initializeDefaultAppClient(APP_ID).then(client =>{
            this.client = client;
            this.client.auth.loginWithCredential(new AnonymousCredential()) // TODO oauth
            .then(user => {
                console.log(`successfully logged in anonymously as ${user.id}`);
                const mongoClient = this.client.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"
                );
                this.mongoClient = mongoClient;
                res('success');
            })
            .catch(err => {
                console.log(`failed to log in: ${err}`);
                rej(err);
            });
        });
        });
    }

   loginWithEmail = async (email, password) => {
        console.log("Logging in with email");
      const credential = new UserPasswordCredential(email, password);
      this.client.auth.loginWithCredential(credential)
        .then(user => {
          console.log(`successfully logged in with id: ${user.id}`)
          console.log(this.client.auth.user.profile);
        })
        .catch(err => console.error(`login failed with error: ${err}`))
   }

   signupWithEmail = (name, email, password) => {
     this.client.auth.getProviderClient(UserPasswordAuthProviderClient.factory, "userpass")
        .registerWithEmail(email, password)
        .then(() => console.log("Successfully signed up"))
        .catch(err => console.error("Error registering new user:", err));
      const sleepUsers = this.mongoClient.db("sleepwithhomies").collection("sleepusers");
      const newUser = {
        'name': name,
        'id': this.client.auth.user.id,
      };
      sleepUsers.insertOne(newUser)
        .then(result => console.log(`success: inserted at ${result.insertedId}`))
        .catch(err => console.error(`Failed to insert item: ${err}`));
   }

  joinGroup = async (code) => {
    //TODO add user to group and sync with db
    if(this.mongoClient){
      const groups = this.mongoClient.db("sleepwithhomies").collection("groups");
      const leaderboards = this.mongoClient.db("sleepwithhomies").collection("leaderboards");
      const query = {"code" : code};
      const queryBoard = {"groupCode" : code};
      groups.findOne(query)
        .then(doc => {
          if(doc){
            const userId = this.client.auth.user.id;

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

          }else{
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
              "users": [this.client.auth.user.id],
            };

            const newLeaderboard = {
              "groupCode": result,
              "scores": {[this.client.auth.user.id]: 0},
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

  getGroups = (id=this.client.auth.user.id) => {
    return new Promise ((res, rej) => {
      if(this.mongoClient){
        const groups = this.mongoClient.db("sleepwithhomies").collection("groups");
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
      }else{
        rej(Error("No mongoClient?"));
      }
    });
  }

  leaveGroup = (code) => {
    if(this.mongoClient){
      const groups = this.mongoClient.db("sleepwithhomies").collection("groups");
      const query = {"code" : code};
      groups.findOne(query)
        .then(doc => {
          if(doc){
            let users = doc.users
            users.splice(users.findIndex(element => element == this.client.auth.user.id), 1)
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
          }else{
            console.log(`couldn't find group`);
          }
        })
        .catch(err => {
          console.log(`failed: ${err}`);
        });
      }
  }

  updateLeaderboard = (code, update={}) => {
    if(this.mongoClient){
      const leaderboards = this.mongoClient.db("sleepwithhomies").collection("leaderboards");
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
      if(this.mongoClient){
        const groups = this.mongoClient.db("sleepwithhomies").collection("groups");
        const leaderboards = this.mongoClient.db("sleepwithhomies").collection("leaderboards");
        const sleepUsers = this.mongoClient.db("sleepwithhomies").collection("sleepusers");
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

  testFunc = () => {
    console.log("passed!!!");
  }
}

export default MongoDB;