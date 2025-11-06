import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Fade,
  Zoom
} from '@mui/material';

export default function PasswordProtection({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onAuthenticated(password);
    
    if (!success) {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 3000);
      setPassword('');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="sm">
        <Zoom in={true} timeout={500}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'visible',
              animation: shake ? 'shake 0.5s' : 'none',
              '@keyframes shake': {
                '0%, 100%': { transform: 'translateX(0)' },
                '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
                '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
              }
            }}
          >
            <CardContent sx={{ p: 6 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Fade in={true} timeout={800}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: '4rem',
                      mb: 2,
                      animation: 'float 3s ease-in-out infinite',
                      '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-10px)' },
                      }
                    }}
                  >
                    ⚽
                  </Typography>
                </Fade>
                <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
                  Jay's Footy Stats
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Enter password to access your stats
                </Typography>
              </Box>

              <Fade in={true} timeout={1000}>
                <form onSubmit={handleSubmit}>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Password"
                      variant="outlined"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={error}
                      autoFocus
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: 'all 0.3s ease',
                        }
                      }}
                    />
                  </Box>

                  {error && (
                    <Fade in={error}>
                      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        Incorrect password. Please try again.
                      </Alert>
                    </Fade>
                  )}

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!password}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 20px -5px rgba(102, 126, 234, 0.4)',
                      },
                      '&:active': {
                        transform: 'translateY(0px)',
                      }
                    }}
                  >
                    Enter App
                  </Button>
                </form>
              </Fade>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  🔒 Secure access to your AFL statistics
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Zoom>
      </Container>
    </Box>
  );
}
