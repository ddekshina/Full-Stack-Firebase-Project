import { registerRootComponent } from 'expo';
import App from './App';
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// Register the app
registerRootComponent(App);