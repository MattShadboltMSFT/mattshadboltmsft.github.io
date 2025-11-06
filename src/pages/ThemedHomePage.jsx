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
    } else if (currentTheme === 'minimalistClean') {
      return `min-h-screen ${theme.colors.bgPrimary}`;
    } else if (currentTheme === 'materialDesign') {
      return `min-h-screen ${theme.colors.bgPrimary}`;
    }
    return `min-h-screen ${theme.colors.bgPrimary}`;
  };

  return (
    <div className={getBackgroundClass()}>
      {/* Header - Modern Navigation */}
      <div className={`${currentTheme === 'vibrantGradient' ? 'bg-gradient-to-r' : ''} ${currentTheme === 'modernPremium' ? 'bg-white border-b border-modern-border-light' : theme.colors.bgSecondary} ${currentTheme === 'modernPremium' ? theme.colors.textPrimary : theme.colors.textInverse} py-4 px-6 ${currentTheme === 'modernPremium' ? 'shadow-modern-sm' : 'shadow-2xl'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${currentTheme === 'modernPremium' ? 'bg-gradient-to-br from-modern-accent-primary to-modern-accent-secondary' : 'bg-white/20'} rounded-modern flex items-center justify-center`}>
                <span className="text-2xl">⚽</span>
              </div>
              <div>
                <h1 className={`${currentTheme === 'modernPremium' ? 'text-modern-2xl font-bold' : 'text-3xl font-bold'}`}>Jays Footy Stats</h1>
                <p className={`${currentTheme === 'modernPremium' ? 'text-modern-sm' : 'text-sm'} ${theme.colors.textSecondary} mt-0.5`}>
                  {player?.teamName} • Season {player?.season}
                </p>
              </div>
            </div>
            <ThemeSelector />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section - Modern CTA */}
        {currentTheme === 'modernPremium' && (
          <div className={`${theme.styles.hero} p-8 mb-8 ${theme.styles.section}`}>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-modern-4xl font-bold text-modern-text-primary mb-3">
                Track Your Season
              </h2>
              <p className="text-modern-lg text-modern-text-secondary mb-6">
                Record every game, analyze your performance, and watch your stats improve throughout the season.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/match/new"
                  className={`${theme.colors.btnPrimary} px-6 py-3 text-modern-base font-semibold ${theme.styles.button} inline-flex items-center justify-center gap-2`}
                >
                  <span className="text-lg">+</span>
                  <span>Add New Match</span>
                </Link>
                <Link
                  to="/dashboard"
                  className={`${theme.colors.btnSecondary} px-6 py-3 text-modern-base font-semibold ${theme.styles.button} inline-flex items-center justify-center gap-2`}
                >
                  <span>📊</span>
                  <span>View Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Action - Non-Modern Themes */}
        {currentTheme !== 'modernPremium' && (
          <div className="mb-6">
            <Link
              to="/match/new"
              className={`block w-full ${theme.colors.btnPrimary} ${currentTheme === 'modernPremium' ? theme.colors.textInverse : theme.colors.textPrimary} py-4 px-6 text-center text-xl font-bold ${theme.styles.button}`}
            >
              + New Match
            </Link>
          </div>
        )}

        {/* Test Data Controls */}
        {testDataLoaded && (
          <div className={`${theme.colors.bgCard} ${currentTheme === 'modernPremium' ? 'bg-amber-50 border-amber-200' : ''} px-5 py-4 ${theme.styles.card} border ${theme.colors.border} ${theme.styles.section}`}>
            <div className="flex items-start gap-3">
              <span className={`text-xl ${currentTheme === 'modernPremium' ? 'text-amber-600' : ''}`}>⚠️</span>
              <div className="flex-1">
                <p className={`font-semibold ${theme.colors.textPrimary} mb-1 ${currentTheme === 'modernPremium' ? 'text-modern-base' : ''}`}>Test Data Loaded</p>
                <p className={`${currentTheme === 'modernPremium' ? 'text-modern-sm' : 'text-sm'} ${theme.colors.textSecondary}`}>
                  You are viewing test data from the 2025 fixture. Real matches are not affected.
                </p>
                <button
                  onClick={handleClearTestData}
                  className={`mt-3 ${theme.colors.btnSecondary} px-4 py-2 ${theme.styles.button} ${currentTheme === 'modernPremium' ? 'text-modern-sm' : 'text-sm'}`}
                >
                  Clear Test Data
                </button>
              </div>
            </div>
          </div>
        )}

        {!testDataLoaded && stats?.totalGames === 0 && (
          <div className={`${theme.colors.bgCard} ${currentTheme === 'modernPremium' ? 'bg-blue-50 border-blue-200' : ''} px-5 py-4 ${theme.styles.card} border ${theme.colors.border} ${theme.styles.section}`}>
            <div className="flex items-start gap-3">
              <span className={`text-xl ${currentTheme === 'modernPremium' ? 'text-blue-600' : ''}`}>ℹ️</span>
              <div className="flex-1">
                <p className={`font-semibold ${theme.colors.textPrimary} mb-1 ${currentTheme === 'modernPremium' ? 'text-modern-base' : ''}`}>No Matches Yet</p>
                <p className={`${currentTheme === 'modernPremium' ? 'text-modern-sm' : 'text-sm'} ${theme.colors.textSecondary} mb-3`}>
                  Load test data to see how the dashboard looks with sample matches, or add a real match.
                </p>
                <button
                  onClick={handleLoadTestData}
                  className={`${theme.colors.btnSecondary} px-4 py-2 ${theme.styles.button} ${currentTheme === 'modernPremium' ? 'text-modern-sm' : 'text-sm'}`}
                >
                  Load Test Data (17 matches)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Season Summary */}
        {stats && stats.totalGames > 0 && (
          <div className={`${theme.colors.bgCard} ${theme.styles.card} ${currentTheme === 'modernPremium' ? 'p-8' : 'p-6'} border ${theme.colors.border} ${theme.styles.section}`}>
            <h2 className={`${currentTheme === 'modernPremium' ? 'text-modern-3xl' : 'text-2xl'} font-bold mb-6 ${theme.colors.textPrimary}`}>Season Summary</h2>
            
            {/* Games Played - Prominent Display */}
            <div className={`mb-6 ${currentTheme === 'modernPremium' ? 'pb-6 border-b border-modern-border-light' : ''}`}>
              <p className={`${currentTheme === 'modernPremium' ? 'text-modern-sm' : 'text-sm'} ${theme.colors.textSecondary} mb-2 font-medium uppercase tracking-wide`}>Games Played</p>
              <p className={`${currentTheme === 'modernPremium' ? 'text-modern-4xl' : 'text-4xl'} font-bold ${theme.colors.textAccent}`}>{stats.totalGames}</p>
            </div>

            {/* Key Stats Grid */}
            <div className={`grid grid-cols-3 gap-${currentTheme === 'modernPremium' ? '4' : '4'} mb-6`}>
              <div className={`text-center ${currentTheme === 'modernPremium' ? 'bg-emerald-50 border-emerald-200' : theme.colors.bgCard} ${theme.styles.card} ${currentTheme === 'modernPremium' ? 'p-4' : 'p-3'} border`}>
                <p className={`${currentTheme === 'modernPremium' ? 'text-modern-3xl' : 'text-2xl'} font-bold ${theme.colors.statSuccess}`}>{stats.stats.goals}</p>
                <p className={`${currentTheme === 'modernPremium' ? 'text-modern-sm' : 'text-sm'} ${theme.colors.textSecondary} font-medium mt-1`}>Goals</p>
              </div>
              <div className={`text-center ${currentTheme === 'modernPremium' ? 'bg-blue-50 border-blue-200' : theme.colors.bgCard} ${theme.styles.card} ${currentTheme === 'modernPremium' ? 'p-4' : 'p-3'} border`}>
                <p className={`${currentTheme === 'modernPremium' ? 'text-modern-3xl' : 'text-2xl'} font-bold ${theme.colors.textPrimary}`}>{stats.stats.kicks}</p>
                <p className={`${currentTheme === 'modernPremium' ? 'text-modern-sm' : 'text-sm'} ${theme.colors.textSecondary} font-medium mt-1`}>Kicks</p>
              </div>
              <div className={`text-center ${currentTheme === 'modernPremium' ? 'bg-purple-50 border-purple-200' : theme.colors.bgCard} ${theme.styles.card} ${currentTheme === 'modernPremium' ? 'p-4' : 'p-3'} border`}>
                <p className={`${currentTheme === 'modernPremium' ? 'text-modern-3xl' : 'text-2xl'} font-bold ${theme.colors.textPrimary}`}>{stats.stats.marks}</p>
                <p className={`${currentTheme === 'modernPremium' ? 'text-modern-sm' : 'text-sm'} ${theme.colors.textSecondary} font-medium mt-1`}>Marks</p>
              </div>
            </div>

            {/* Averages */}
            <div className={`${currentTheme === 'modernPremium' ? 'border-t border-modern-border-light pt-6' : 'border-t ' + theme.colors.border + ' pt-4'}`}>
              <p className={`${currentTheme === 'modernPremium' ? 'text-modern-sm' : 'text-sm'} font-semibold ${theme.colors.textPrimary} mb-3 uppercase tracking-wide`}>Per Game Averages</p>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className={`${currentTheme === 'modernPremium' ? 'bg-neutral-50' : theme.colors.bgCard} ${theme.styles.card} p-3 border ${currentTheme === 'modernPremium' ? 'border-modern-border-light' : ''}`}>
                  <p className={`font-bold ${theme.colors.textPrimary} ${currentTheme === 'modernPremium' ? 'text-modern-xl' : 'text-base'}`}>{stats.averages.kicks}</p>
                  <p className={`${theme.colors.textSecondary} ${currentTheme === 'modernPremium' ? 'text-modern-xs' : 'text-xs'} mt-1`}>Kicks</p>
                </div>
                <div className={`${currentTheme === 'modernPremium' ? 'bg-neutral-50' : theme.colors.bgCard} ${theme.styles.card} p-3 border ${currentTheme === 'modernPremium' ? 'border-modern-border-light' : ''}`}>
                  <p className={`font-bold ${theme.colors.textPrimary} ${currentTheme === 'modernPremium' ? 'text-modern-xl' : 'text-base'}`}>{stats.averages.handballs}</p>
                  <p className={`${theme.colors.textSecondary} ${currentTheme === 'modernPremium' ? 'text-modern-xs' : 'text-xs'} mt-1`}>Handballs</p>
                </div>
                <div className={`${currentTheme === 'modernPremium' ? 'bg-neutral-50' : theme.colors.bgCard} ${theme.styles.card} p-3 border ${currentTheme === 'modernPremium' ? 'border-modern-border-light' : ''}`}>
                  <p className={`font-bold ${theme.colors.textPrimary} ${currentTheme === 'modernPremium' ? 'text-modern-xl' : 'text-base'}`}>{stats.averages.tackles}</p>
                  <p className={`${theme.colors.textSecondary} ${currentTheme === 'modernPremium' ? 'text-modern-xs' : 'text-xs'} mt-1`}>Tackles</p>
                </div>
                <div className={`${currentTheme === 'modernPremium' ? 'bg-neutral-50' : theme.colors.bgCard} ${theme.styles.card} p-3 border ${currentTheme === 'modernPremium' ? 'border-modern-border-light' : ''}`}>
                  <p className={`font-bold ${theme.colors.textPrimary} ${currentTheme === 'modernPremium' ? 'text-modern-xl' : 'text-base'}`}>{stats.averages.marks}</p>
                  <p className={`${theme.colors.textSecondary} ${currentTheme === 'modernPremium' ? 'text-modern-xs' : 'text-xs'} mt-1`}>Marks</p>
                </div>
              </div>
            </div>

            <Link
              to="/dashboard"
              className={`block mt-6 text-center ${theme.colors.textAccent} ${currentTheme === 'modernPremium' ? 'text-modern-base' : 'text-base'} font-semibold hover:opacity-80 transition-opacity`}
            >
              View Full Dashboard →
            </Link>
          </div>
        )}

        {/* Recent Matches */}
        {recentMatches.length > 0 && (
          <div className={`${theme.colors.bgCard} ${theme.styles.card} ${currentTheme === 'modernPremium' ? 'p-8' : 'p-6'} border ${theme.colors.border} ${theme.styles.section}`}>
            <h2 className={`${currentTheme === 'modernPremium' ? 'text-modern-2xl' : 'text-xl'} font-bold mb-6 ${theme.colors.textPrimary}`}>Recent Matches</h2>
            <div className={`space-y-${currentTheme === 'modernPremium' ? '3' : '3'}`}>
              {recentMatches.map((match) => (
                <Link
                  key={match.id}
                  to={`/match/${match.id}/view`}
                  className={`block border ${theme.colors.border} ${theme.styles.card} ${currentTheme === 'modernPremium' ? 'p-5' : 'p-4'} ${theme.colors.bgCardHover} transition-all duration-200 group`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className={`font-semibold ${theme.colors.textPrimary} ${currentTheme === 'modernPremium' ? 'text-modern-lg group-hover:text-modern-accent-primary transition-colors' : ''}`}>vs {match.opponent}</p>
                      <p className={`${currentTheme === 'modernPremium' ? 'text-modern-sm' : 'text-sm'} ${theme.colors.textSecondary} mt-1`}>
                        {new Date(match.date).toLocaleDateString()} • {match.venue}
                      </p>
                      {match.isTestData && (
                        <span className={`${currentTheme === 'modernPremium' ? 'text-modern-xs bg-amber-100 text-amber-700 border border-amber-200' : 'text-xs ' + theme.colors.bgCard + ' ' + theme.colors.statWarning} px-2 py-1 ${theme.styles.badge} mt-2 inline-block`}>
                          Test Data
                        </span>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className={`${currentTheme === 'modernPremium' ? 'text-modern-base' : 'text-sm'} font-semibold ${theme.colors.statSuccess}`}>
                        {match.stats.goals}G {match.stats.behinds}B
                      </p>
                      <p className={`${currentTheme === 'modernPremium' ? 'text-modern-sm' : 'text-xs'} ${theme.colors.textSecondary} mt-1`}>
                        {match.stats.kicks}K {match.stats.marks}M
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              to="/history"
              className={`block mt-6 text-center ${theme.colors.textAccent} ${currentTheme === 'modernPremium' ? 'text-modern-base' : 'text-base'} font-semibold hover:opacity-80 transition-opacity`}
            >
              View All Matches →
            </Link>
          </div>
        )}

        {/* Navigation Cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${theme.styles.section}`}>
          <Link
            to="/dashboard"
            className={`${theme.colors.bgCard} ${theme.styles.card} ${currentTheme === 'modernPremium' ? 'p-8' : 'p-6'} text-center ${theme.colors.bgCardHover} transition-all duration-200 border ${theme.colors.border} group`}
          >
            <div className={`${currentTheme === 'modernPremium' ? 'w-12 h-12 bg-gradient-to-br from-modern-accent-primary to-modern-accent-secondary rounded-modern flex items-center justify-center mx-auto mb-3' : ''}`}>
              <p className={`${currentTheme === 'modernPremium' ? 'text-3xl' : 'text-2xl mb-2'}`}>📊</p>
            </div>
            <p className={`font-semibold ${theme.colors.textPrimary} ${currentTheme === 'modernPremium' ? 'text-modern-lg group-hover:text-modern-accent-primary transition-colors' : ''}`}>Dashboard</p>
            {currentTheme === 'modernPremium' && (
              <p className="text-modern-sm text-modern-text-secondary mt-1">View stats and trends</p>
            )}
          </Link>
          <Link
            to="/history"
            className={`${theme.colors.bgCard} ${theme.styles.card} ${currentTheme === 'modernPremium' ? 'p-8' : 'p-6'} text-center ${theme.colors.bgCardHover} transition-all duration-200 border ${theme.colors.border} group`}
          >
            <div className={`${currentTheme === 'modernPremium' ? 'w-12 h-12 bg-gradient-to-br from-modern-accent-info to-modern-accent-primary rounded-modern flex items-center justify-center mx-auto mb-3' : ''}`}>
              <p className={`${currentTheme === 'modernPremium' ? 'text-3xl' : 'text-2xl mb-2'}`}>📋</p>
            </div>
            <p className={`font-semibold ${theme.colors.textPrimary} ${currentTheme === 'modernPremium' ? 'text-modern-lg group-hover:text-modern-accent-primary transition-colors' : ''}`}>Match History</p>
            {currentTheme === 'modernPremium' && (
              <p className="text-modern-sm text-modern-text-secondary mt-1">Browse past games</p>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
