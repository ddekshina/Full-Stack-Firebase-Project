'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Avatar, Paper, Divider } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the FCM component to avoid SSR issues
const FCMNotificationHandler = dynamic(
  () => import('./FCMNotificationHandler'),
  { ssr: false }
);

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // If user is not logged in, redirect to login
  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
  }, [user, router, mounted]);

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  // If user is null (still loading), show loading state
  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar 
              src={user.photoURL || undefined} 
              alt={user.displayName || "User"} 
              sx={{ width: 80, height: 80, mb: 2 }}
            />
            <Typography component="h1" variant="h5">
              {user.displayName}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {user.email}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>User ID:</strong> {user.uid}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}
            </Typography>
          </Box>
          
          {/* FCM Notification Handler */}
          <FCMNotificationHandler />
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={logout}
            >
              Sign Out
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}