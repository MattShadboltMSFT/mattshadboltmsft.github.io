import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { getSeasonStats, getAllMatches } from '../services/matchService';
import { hasTestData, loadTestData, clearAllTestData } from '../services/testDataService';
import ThemeSelector from '../components/ThemeSelector';

export default function ThemedHomePage() {
  const { player } = useApp();
  const { theme, currentTheme } = useTheme();
  const [stats, setStats] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [testDataLoaded, setTestDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!player) return;
      
      try {
        const seasonStats = await getSeasonStats(player.id, player.season);
        setStats(seasonStats);
        
        const matches = await getAllMatches(player.id);
        setRecentMatches(matches.slice(0, 3));
        
        const hasTest = await hasTestData();
        setTestDataLoaded(hasTest);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [player]);

  const handleLoadTestData = async () => {
    try {
      const count = await loadTestData(player.id);
      alert(`Loaded ${count} test matches successfully!`);
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClearTestData = async () => {
    if (window.confirm('Are you sure you want to clear all test data? This cannot be undone.')) {
      try {
        const count = await clearAllTestData();
        alert(`Cleared ${count} test matches successfully!`);
        window.location.reload();
      } catch (error) {
        alert('Failed to clear test data: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.colors.bgPrimary} flex items-center justify-center`}>
        <div className={`text-xl ${theme.colors.textPrimary}`}>Loading...</div>
      </div>
    );
  }

  // Background class based on theme
  const getBackgroundClass = () => {
    if (currentTheme === 'vibrantGradient') {
      return `min-h-screen bg-gradient-to-br ${theme.colors.bgPrimary}`;
    }
    return `min-h-screen ${theme.colors.bgPrimary}`;
  };

  return (
    <div className={getBackgroundClass()}>
      {/* Header */}
      <div className={`${currentTheme === 'vibrantGradient' ? 'bg-gradient-to-r' : ''} ${theme.colors.bgSecondary} ${theme.colors.textPrimary} p-6 shadow-2xl`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Jays Footy Stats</h1>
              <p className={`text-sm ${theme.colors.textSecondary} mt-1`}>
                {player?.teamName} - Season {player?.season}
              </p>
            </div>
            <ThemeSelector />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Quick Action */}
        <div>
          <Link
            to="/match/new"
            className={`block w-full ${theme.colors.btnPrimary} ${theme.colors.textPrimary} py-4 px-6 text-center text-xl font-bold ${theme.styles.button}`}
          >
            + New Match
          </Link>
        </div>

        {/* Test Data Controls */}
        {testDataLoaded && (
          <div className={`${theme.colors.bgCard} ${theme.colors.textSecondary} px-4 py-3 ${theme.styles.card} border ${theme.colors.border}`}>
            <p className={`font-semibold ${theme.colors.textPrimary}`}>Test Data Loaded</p>
            <p className="text-sm">
              You are viewing test data from the 2025 fixture. Real matches are not affected.
            </p>
            <button
              onClick={handleClearTestData}
              className={`mt-2 ${theme.colors.btnSecondary} px-4 py-2 ${theme.styles.button} text-sm`}
            >
              Clear Test Data
            </button>
          </div>
        )}

        {!testDataLoaded && stats?.totalGames === 0 && (
          <div className={`${theme.colors.bgCard} ${theme.colors.textSecondary} px-4 py-3 ${theme.styles.card} border ${theme.colors.border}`}>
            <p className={`font-semibold ${theme.colors.textPrimary}`}>No Matches Yet</p>
            <p className="text-sm mb-2">
              Load test data to see how the dashboard looks with sample matches, or add a real match.
            </p>
            <button
              onClick={handleLoadTestData}
              className={`${theme.colors.btnSecondary} px-4 py-2 ${theme.styles.button} text-sm`}
            >
              Load Test Data (17 matches)
            </button>
          </div>
        )}

        {/* Season Summary */}
        {stats && stats.totalGames > 0 && (
          <div className={`${theme.colors.bgCard} ${theme.styles.card} p-6 border ${theme.colors.border}`}>
            <h2 className={`text-2xl font-bold mb-4 ${theme.colors.textPrimary}`}>Season Summary</h2>
            
            {/* Games Played */}
            <div className="mb-4">
              <p className={`${theme.colors.textSecondary} text-sm`}>Games Played</p>
              <p className={`text-4xl font-bold ${theme.colors.textAccent}`}>{stats.totalGames}</p>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className={`text-center ${theme.colors.bgCard} ${theme.styles.card} p-3`}>
                <p className={`text-2xl font-bold ${theme.colors.statSuccess}`}>{stats.stats.goals}</p>
                <p className={`text-sm ${theme.colors.textSecondary}`}>Goals</p>
              </div>
              <div className={`text-center ${theme.colors.bgCard} ${theme.styles.card} p-3`}>
                <p className={`text-2xl font-bold ${theme.colors.textPrimary}`}>{stats.stats.kicks}</p>
                <p className={`text-sm ${theme.colors.textSecondary}`}>Kicks</p>
              </div>
              <div className={`text-center ${theme.colors.bgCard} ${theme.styles.card} p-3`}>
                <p className={`text-2xl font-bold ${theme.colors.textPrimary}`}>{stats.stats.marks}</p>
                <p className={`text-sm ${theme.colors.textSecondary}`}>Marks</p>
              </div>
            </div>

            {/* Averages */}
            <div className={`border-t ${theme.colors.border} pt-4`}>
              <p className={`text-sm font-semibold ${theme.colors.textPrimary} mb-2`}>Per Game Averages</p>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div className={`${theme.colors.bgCard} ${theme.styles.card} p-2`}>
                  <p className={`font-bold ${theme.colors.textPrimary}`}>{stats.averages.kicks}</p>
                  <p className={`${theme.colors.textSecondary} text-xs`}>Kicks</p>
                </div>
                <div className={`${theme.colors.bgCard} ${theme.styles.card} p-2`}>
                  <p className={`font-bold ${theme.colors.textPrimary}`}>{stats.averages.handballs}</p>
                  <p className={`${theme.colors.textSecondary} text-xs`}>Handballs</p>
                </div>
                <div className={`${theme.colors.bgCard} ${theme.styles.card} p-2`}>
                  <p className={`font-bold ${theme.colors.textPrimary}`}>{stats.averages.tackles}</p>
                  <p className={`${theme.colors.textSecondary} text-xs`}>Tackles</p>
                </div>
                <div className={`${theme.colors.bgCard} ${theme.styles.card} p-2`}>
                  <p className={`font-bold ${theme.colors.textPrimary}`}>{stats.averages.marks}</p>
                  <p className={`${theme.colors.textSecondary} text-xs`}>Marks</p>
                </div>
              </div>
            </div>

            <Link
              to="/dashboard"
              className={`block mt-4 text-center ${theme.colors.textAccent} font-semibold hover:opacity-80 transition-opacity`}
            >
              View Full Dashboard →
            </Link>
          </div>
        )}

        {/* Recent Matches */}
        {recentMatches.length > 0 && (
          <div className={`${theme.colors.bgCard} ${theme.styles.card} p-6 border ${theme.colors.border}`}>
            <h2 className={`text-xl font-bold mb-4 ${theme.colors.textPrimary}`}>Recent Matches</h2>
            <div className="space-y-3">
              {recentMatches.map((match) => (
                <Link
                  key={match.id}
                  to={`/match/${match.id}/view`}
                  className={`block border ${theme.colors.border} ${theme.styles.card} p-4 ${theme.colors.bgCardHover} transition-all duration-200`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-semibold ${theme.colors.textPrimary}`}>vs {match.opponent}</p>
                      <p className={`text-sm ${theme.colors.textSecondary}`}>
                        {new Date(match.date).toLocaleDateString()} • {match.venue}
                      </p>
                      {match.isTestData && (
                        <span className={`text-xs ${theme.colors.bgCard} ${theme.colors.statWarning} px-2 py-1 ${theme.styles.badge} mt-1 inline-block`}>
                          Test Data
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${theme.colors.statSuccess}`}>
                        {match.stats.goals}G {match.stats.behinds}B
                      </p>
                      <p className={`text-xs ${theme.colors.textSecondary}`}>
                        {match.stats.kicks}K {match.stats.marks}M
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              to="/history"
              className={`block mt-4 text-center ${theme.colors.textAccent} font-semibold hover:opacity-80 transition-opacity`}
            >
              View All Matches →
            </Link>
          </div>
        )}

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/dashboard"
            className={`${theme.colors.bgCard} ${theme.styles.card} p-6 text-center ${theme.colors.bgCardHover} transition-all duration-200 border ${theme.colors.border}`}
          >
            <p className="text-2xl mb-2">📊</p>
            <p className={`font-semibold ${theme.colors.textPrimary}`}>Dashboard</p>
          </Link>
          <Link
            to="/history"
            className={`${theme.colors.bgCard} ${theme.styles.card} p-6 text-center ${theme.colors.bgCardHover} transition-all duration-200 border ${theme.colors.border}`}
          >
            <p className="text-2xl mb-2">📋</p>
            <p className={`font-semibold ${theme.colors.textPrimary}`}>Match History</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
