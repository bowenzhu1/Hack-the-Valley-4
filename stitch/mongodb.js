import { RemoteMongoClient } from "mongodb-stitch-browser-sdk";
import { app } from "./app";

// TODO: Initialize a MongoDB Service Client
const mongoClient = app.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas" // might need to change this if its named differently @aydan
);

// TODO: Instantiate a collection handle for todo.items
const items = mongodb("SOMETHING HERE").collection("SOMETHING ELSE")

export { items };
