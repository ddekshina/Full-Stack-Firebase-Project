'use client';

import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';

export default function Login() {
  const { signInWithGoogle, user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // If user is already logged in, redirect to profile
  useEffect(() => {
    if (mounted && user) {
      router.push('/profile');
    }
  }, [user, router, mounted]);

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Sign In
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Please sign in to access your profile
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<GoogleIcon />}
              onClick={signInWithGoogle}
              size="large"
              sx={{ py: 1.5 }}
            >
              Sign in with Google
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}