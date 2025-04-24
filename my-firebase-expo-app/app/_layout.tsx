import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Device from 'expo-device';
import messaging from '@react-native-firebase/messaging';
import { StatusBar } from 'expo-status-bar';

import type { WebView as WebViewType } from 'react-native-webview';

const [fcmToken, setFcmToken] = useState<string | null>(null);


// Replace with your deployed Next.js application URL
// For testing locally, use your machine's local IP address (not localhost)
const WEB_URL = 'https://your-nextjs-firebase-app-url.vercel.app';  

export default function App() {
  const webViewRef = useRef<WebViewType | null>(null);

  const [fcmToken, setFcmToken] = useState(null);
  
  // Request permission for notifications 
  async function requestUserPermission() {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled = 
        authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } else {
      // Android permissions are requested during app installation
    }
  }

  // Get FCM token
  const getFCMToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      

      
      // You could send this token to your Next.js backend
      // to associate it with the user after they log in
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Request permission and get FCM token
      requestUserPermission();
      getFCMToken();

      // Listen for token refresh
      const unsubscribe = messaging().onTokenRefresh(token => {
        console.log('FCM Token refreshed:', token);
        

      });

      // Handle foreground messages
      const foregroundSubscription = messaging().onMessage(async remoteMessage => {
        console.log('Foreground Message received:', remoteMessage);
        Alert.alert(
          remoteMessage.notification?.title || 'New Message',
          remoteMessage.notification?.body || '',
        );
        
        // You can also pass the notification to the WebView
        if (webViewRef.current) {
          webViewRef.current.postMessage(JSON.stringify({
            type: 'FCM_TOKEN',
            token: fcmToken
          }));
        }
      });

      // Handle notification when app is in background and opened
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification opened app:', remoteMessage);
        // You can navigate to specific screens based on the notification data
      });

      // Check if app was opened from a notification when app was closed
      messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from quit state:', remoteMessage);
          // Handle initial notification if needed
        }
      });

      return () => {
        unsubscribe();
        foregroundSubscription();
      };
    }
  }, []);

  // Handle messages from WebView
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Message from WebView:', data);
      
      // Handle specific message types from the web app
      if (data.type === 'INIT' && fcmToken) {
        // Send FCM token to web app when it initializes
        if (webViewRef.current) {
          webViewRef.current.postMessage(JSON.stringify({
            type: 'FCM_TOKEN',
            token: fcmToken
          }));
      }
      }
    } catch (error) {
      console.log('Error parsing WebView message:', error);
    }
  };

  // JavaScript to inject into WebView
  const injectedJavaScript = `
    // Enable communication between WebView and React Native
    window.addEventListener('message', function(event) {
      try {
        const data = JSON.parse(event.data);
        console.log('Message from React Native:', data);
        
        // Handle specific message types
        if (data.type === 'FCM_TOKEN') {
          // Store token in localStorage or handle as needed
          localStorage.setItem('fcmToken', data.token);
          // Dispatch an event that your web app can listen for
          window.dispatchEvent(new CustomEvent('fcmTokenReceived', { detail: data.token }));
        } else if (data.type === 'PUSH_NOTIFICATION') {
          // Handle push notification data as needed
          window.dispatchEvent(new CustomEvent('pushNotificationReceived', { detail: data.notification }));
        }
      } catch (error) {
        console.error('Error processing message from React Native:', error);
      }
    });

    // Initialize communication with native app
    function sendToReactNative(data) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    }

    // Send initialization message when page loads
    document.addEventListener('DOMContentLoaded', function() {
      sendToReactNative({ type: 'INIT' });
    });

    // Override the default console.log to see web logs in native console
    (function() {
      const originalConsoleLog = console.log;
      console.log = function(...args) {
        originalConsoleLog.apply(console, args);
        sendToReactNative({ 
          type: 'CONSOLE_LOG', 
          message: args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' ') 
        });
      };
    })();

    true;
  `;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_URL }}
        style={styles.webview}
        onMessage={handleMessage}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsBackForwardNavigationGestures={true}
        allowUniversalAccessFromFileURLs={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
});