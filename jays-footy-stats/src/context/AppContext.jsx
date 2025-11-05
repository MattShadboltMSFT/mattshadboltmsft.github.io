import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDefaultPlayer, initDatabase } from '../db/db';

const AppContext = createContext();

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export function AppProvider({ children }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initialize() {
      try {
        await initDatabase();
        const defaultPlayer = await getDefaultPlayer();
        setPlayer(defaultPlayer);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  const value = {
    player,
    setPlayer,
    loading,
    error
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
