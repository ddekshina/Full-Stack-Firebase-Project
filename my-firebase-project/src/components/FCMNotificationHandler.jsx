
'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function FCMNotificationHandler() {
  const [fcmToken, setFcmToken] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Try to get FCM token from local storage first (for web testing)
    const storedToken = localStorage.getItem('fcmToken');
    if (storedToken) {
      setFcmToken(storedToken);
    }

    // Listen for FCM token from the Expo app
    const tokenListener = window.addEventListener('fcmTokenReceived', (event) => {
      console.log('FCM token received from Expo:', event.detail);
      setFcmToken(event.detail);
      localStorage.setItem('fcmToken', event.detail);
    });

    // Listen for notifications from the Expo app
    const notificationListener = window.addEventListener('pushNotificationReceived', (event) => {
      console.log('Push notification received from Expo:', event.detail);
      setNotifications(prev => [event.detail, ...prev].slice(0, 5)); // Keep only the 5 most recent
    });

    // Cleanup
    return () => {
      window.removeEventListener('fcmTokenReceived', tokenListener);
      window.removeEventListener('pushNotificationReceived', notificationListener);
    };
  }, []);

  // Detect if running in WebView
  const [isInWebView, setIsInWebView] = useState(false);
  
  useEffect(() => {
    // Check if we're running inside a WebView
    const checkWebView = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return userAgent.includes('wv') || window.ReactNativeWebView !== undefined;
    };
    
    setIsInWebView(checkWebView());
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Notification Status
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          <strong>Environment:</strong> {isInWebView ? 'Running in Expo WebView' : 'Running in browser'}
        </Typography>
      </Box>
      
      {fcmToken ? (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
            <strong>FCM Token:</strong> {fcmToken}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No FCM token available. {isInWebView ? 'Waiting for token from Expo app...' : 'This feature requires Expo WebView.'}
        </Typography>
      )}

      {notifications.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Recent Notifications:</Typography>
          {notifications.map((notification, index) => (
            <Paper key={index} elevation={1} sx={{ p: 2, mb: 1, bgcolor: 'background.paper' }}>
              <Typography variant="subtitle2">{notification.notification?.title || 'Notification'}</Typography>
              <Typography variant="body2">{notification.notification?.body || 'No content'}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
}