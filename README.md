# Hack-the-Valley-4
Hackathon project for Hack the Valley 4
This branch contains the database skeleton, ideally none of this
should need to be edited, as its all hosted online (this readme is
a guide in case i fall asleep or in the event of my untimely
death)
useful info:
app id:sleepwithhomies-vfaav
credentials: usr and pass are both admin im so smart
database name: sleepwithhomies
collection name: sleepusers
so a lot of requests will be to sleepwithhomies.sleepusers
data schema:
{
  "title": "sleepuser",
  "properties": {
    "_id": {
      "bsonType": "objectId"
    },
    "alarmtime": {
      "bsonType": "string"
    },
    "currency": {
      "bsonType": "int"
    },
    "title": {
      "bsonType": "string"
    },
    "username": {
      "bsonType": "string"
    }
  }
}

auth commands are in the messenger docs
https://docs.mongodb.com/stitch/tutorials/guides/todo-guide-1/
https://docs.mongodb.com/stitch/tutorials/guides/todo-guide-google/
^^^IF MY STUFF DOESN'T WORK CHECK THESE LINKS^^^

inserting data:
await.items.[update/insert/delete]One(specs in documents)

dispatch({ type: "[update/insert/delete].User", 
payload: { id:  (params go here)} });