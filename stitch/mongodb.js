import { RemoteMongoClient } from "mongodb-stitch-browser-sdk";
import { app } from "./app";

// TODO: Initialize a MongoDB Service Client
const mongoClient = app.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas" // fixed the params in this file --Aydan
);

// TODO: Instantiate a collection handle for todo.items
const items = mongodb("sleepwithhomies").collection("sleepusers")

export { items };
