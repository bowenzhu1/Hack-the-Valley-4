import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
//import BackgroundJob from 'react-native-background-job';

// const backgroundJob = {
//   jobKey: "myJob",
//   job: () => console.log("Running in background")
// };
//
// const backgroundSchedule = {
//   jobKey: "myJob",
//   allowExecutionInForeground: true,
//   period: 5000,
//   exact: true,
// };
//
// BackgroundJob.register(backgroundJob);
// BackgroundJob.schedule(backgroundSchedule);
AppRegistry.registerComponent(appName, () => App);
